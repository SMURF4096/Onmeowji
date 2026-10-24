"""Onmyoji Daily Boss buff predictor (provisional model).

Reference: 2026-08-01 = F (Strong Fire).
Validated against user-provided August 2026 daily observations and
11 first-of-month observations from 2025-12 through 2026-10.
"""
from __future__ import annotations

import argparse
import calendar
import csv
from datetime import date, timedelta
from pathlib import Path

BUFF_NAMES = (
    "Fighting Soul", "Dash", "Skillful", "Fragile",
    "Curse Spell", "Strong Fire", "Raging Wind",
)
REFERENCE_DATE = date(2026, 8, 1)

# Actual observations supplied by the user, not calculated values.
AUGUST_2026_ACTUAL = (
    "F", "G", "B", "C", "D", "E", "F",
    "G", "A", "C", "D", "E", "F", "G",
    "A", "B", "D", "E", "F", "G", "A",
    "B", "C", "E", "F", "G", "A", "B",
    "C", "D", "F",
)
MONTH_START_ACTUAL = {
    date(2025, 12, 1): "B",
    date(2026, 1, 1): "B",
    date(2026, 2, 1): "B",
    date(2026, 3, 1): "F",
    date(2026, 4, 1): "G",
    date(2026, 5, 1): "F",
    date(2026, 6, 1): "G",
    date(2026, 7, 1): "F",
    date(2026, 8, 1): "F",
    date(2026, 9, 1): "G",
    date(2026, 10, 1): "F",
}
OBSERVATIONS = {
    **{date(2026, 8, day): buff for day, buff in enumerate(AUGUST_2026_ACTUAL, 1)},
    **MONTH_START_ACTUAL,
}


def calculate_buff(target_date: date) -> dict:
    """Predict the buff on any Gregorian date using the provisional formula."""
    n = (target_date - REFERENCE_DATE).days
    block, position = divmod(n, 7)  # Works for dates before the reference too.
    index = (block + 5 + position + int(position >= 2)) % 7
    letter = chr(ord("A") + index)
    observed = OBSERVATIONS.get(target_date)
    return {
        "date": target_date.isoformat(),
        "weekday": target_date.strftime("%A"),
        "buff_id": letter,
        "buff_name": BUFF_NAMES[index],
        "seven_day_block": block,
        "position_in_block": position + 1,
        "skipped_buff": chr(ord("A") + (block % 7)),
        "status": "verified" if observed == letter else (
            "mismatch" if observed is not None else "prediction"
        ),
        "observed_buff": observed or "",
    }


def generate_year(year: int) -> list[dict]:
    start = date(year, 1, 1)
    end = date(year + 1, 1, 1)
    return [calculate_buff(start + timedelta(days=i))
            for i in range((end - start).days)]


def print_month(year: int, month: int) -> None:
    print(f"\n{calendar.month_name[month]} {year} (provisional predictions)")
    print("Date        Weekday     Buff                 Status")
    for day in range(1, calendar.monthrange(year, month)[1] + 1):
        r = calculate_buff(date(year, month, day))
        print(f"{r['date']}  {r['weekday']:<10}  "
              f"{r['buff_id']} - {r['buff_name']:<17} {r['status']}")


def validate() -> bool:
    mismatches = []
    for day, expected in sorted(OBSERVATIONS.items()):
        actual = calculate_buff(day)["buff_id"]
        if actual != expected:
            mismatches.append((day, expected, actual))
    print(f"Validated: {len(OBSERVATIONS) - len(mismatches)}/{len(OBSERVATIONS)} "
          "unique observed dates match.")
    for day, expected, actual in mismatches:
        print(f"MISMATCH {day}: observed {expected}, predicted {actual}")
    return not mismatches


def export_year_csv(year: int, filename: str | None = None) -> Path:
    path = Path(filename or f"onmyoji_buffs_{year}.csv")
    rows = generate_year(year)
    with path.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    print(f"Saved {len(rows)} days to {path}")
    return path


def main() -> None:
    parser = argparse.ArgumentParser(description="Onmyoji daily buff predictor")
    parser.add_argument("--date", type=date.fromisoformat, help="YYYY-MM-DD")
    parser.add_argument("--month", type=int, choices=range(1, 13), metavar="1-12")
    parser.add_argument("--year", type=int, default=2026)
    parser.add_argument("--export", action="store_true", help="Export whole year as CSV")
    parser.add_argument("--validate", action="store_true", help="Check all actual observations")
    args = parser.parse_args()
    if args.validate or not (args.date or args.month or args.export):
        validate()
    if args.date:
        print(calculate_buff(args.date))
    if args.month:
        print_month(args.year, args.month)
    if args.export:
        export_year_csv(args.year)


if __name__ == "__main__":
    main()
