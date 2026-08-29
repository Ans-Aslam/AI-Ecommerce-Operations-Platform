import json
from pathlib import Path
from collections import Counter

BASE_DIR = Path(__file__).resolve().parent.parent
WORKFLOW_DIR = BASE_DIR / "source-workflows"
REPORT_FILE = BASE_DIR / "audit" / "workflow-audit-report.txt"


def load_workflow(file_path: Path):
    with file_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def classify_node(node_type: str) -> str:
    node_type_lower = node_type.lower()

    if "webhook" in node_type_lower:
        return "Webhook"
    if "shopify" in node_type_lower:
        return "Shopify"
    if "google" in node_type_lower or "sheet" in node_type_lower:
        return "Google Sheets"
    if "slack" in node_type_lower:
        return "Slack"
    if "whatsapp" in node_type_lower:
        return "WhatsApp"
    if "gmail" in node_type_lower or "email" in node_type_lower:
        return "Email"
    if "smtp" in node_type_lower:
        return "SMTP"
    if "http" in node_type_lower:
        return "HTTP Request"
    if "code" in node_type_lower or "function" in node_type_lower:
        return "Code"
    if "schedule" in node_type_lower or "cron" in node_type_lower:
        return "Schedule"
    if "postgres" in node_type_lower:
        return "PostgreSQL"
    if "supabase" in node_type_lower:
        return "Supabase"
    if "if" in node_type_lower:
        return "Condition"
    if "switch" in node_type_lower:
        return "Switch"
    if "set" in node_type_lower or "editfields" in node_type_lower:
        return "Data Transformation"

    return "Other"


def audit_workflow(file_path: Path):
    data = load_workflow(file_path)

    workflow_name = data.get("name", file_path.stem)
    nodes = data.get("nodes", [])
    connections = data.get("connections", {})

    node_types = Counter()
    categories = Counter()

    node_details = []

    credential_names = set()

    for node in nodes:
        node_name = node.get("name", "Unnamed Node")
        node_type = node.get("type", "Unknown")

        node_types[node_type] += 1
        categories[classify_node(node_type)] += 1

        node_details.append(
            f"    - {node_name} [{node_type}]"
        )

        credentials = node.get("credentials", {})

        for credential_type, credential_data in credentials.items():
            if isinstance(credential_data, dict):
                credential_name = credential_data.get("name")

                if credential_name:
                    credential_names.add(
                        f"{credential_type}: {credential_name}"
                    )

    connection_count = sum(
        len(output_connections)
        for output_connections in connections.values()
    )

    report = []

    report.append("=" * 80)
    report.append(f"FILE: {file_path.relative_to(BASE_DIR)}")
    report.append(f"WORKFLOW NAME: {workflow_name}")
    report.append(f"NODES: {len(nodes)}")
    report.append(f"CONNECTION GROUPS: {len(connections)}")
    report.append(f"CONNECTIONS: {connection_count}")
    report.append("")

    report.append("CATEGORIES:")
    for category, count in sorted(categories.items()):
        report.append(f"  {category}: {count}")

    report.append("")
    report.append("NODE TYPES:")

    for node_type, count in sorted(node_types.items()):
        report.append(f"  {node_type}: {count}")

    report.append("")
    report.append("NODES:")

    report.extend(node_details)

    report.append("")
    report.append("CREDENTIAL REFERENCES:")

    if credential_names:
        for credential in sorted(credential_names):
            report.append(f"  - {credential}")
    else:
        report.append("  - None detected")

    report.append("")
    return "\n".join(report)


def main():
    workflow_files = sorted(WORKFLOW_DIR.rglob("*.json"))

    if not workflow_files:
        print("No workflow JSON files found.")
        return

    reports = []

    print(f"Found {len(workflow_files)} workflow files.")

    for file_path in workflow_files:
        print(f"Auditing: {file_path.name}")

        try:
            reports.append(audit_workflow(file_path))
        except Exception as exc:
            reports.append(
                "\n".join(
                    [
                        "=" * 80,
                        f"FILE: {file_path.relative_to(BASE_DIR)}",
                        "ERROR:",
                        str(exc),
                    ]
                )
            )

    REPORT_FILE.write_text(
        "\n\n".join(reports),
        encoding="utf-8",
    )

    print()
    print("Audit completed.")
    print(f"Report: {REPORT_FILE}")


if __name__ == "__main__":
    main()