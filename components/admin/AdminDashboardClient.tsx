"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";
import * as XLSX from "xlsx";

type Registration = {
  id: number;
  explorer_no?: string;
  child_name?: string;
  age?: number;
  sex?: string;
  birthdate?: string | null;
  barangay?: string | null;
  parent_name?: string | null;
  contact_number?: string | null;
  checked_in?: boolean;
  created_at?: string | null;

  /* Waiver / Consent */
  certification_accepted?: boolean;
  participation_consent?: boolean;
  risk_acknowledgment?: boolean;
  safety_rules_accepted?: boolean;
  emergency_consent?: boolean;
  full_waiver_accepted?: boolean;
  kit_disclaimer_accepted?: boolean;

  waiver_signatory_name?: string | null;
  waiver_relationship?: string | null;
  waiver_version?: string | null;
  waiver_full_text?: string | null;
  waiver_accepted_at?: string | null;
};

export default function AdminDashboardClient() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBarangay, setFilterBarangay] = useState("");
  const [filterSex, setFilterSex] = useState("");

  async function fetchRegistrations() {
    setLoading(true);

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetch error", error);
      setRegistrations([]);
    } else {
      setRegistrations(data as Registration[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void fetchRegistrations();

    const subscription = supabase
      .channel("public:registrations")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "registrations",
        },
        (payload) => {
          setRegistrations((current) => [
            payload.new as Registration,
            ...current,
          ]);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(subscription);
    };
  }, []);

  const filtered = registrations.filter((r) => {
    if (search) {
      const s = search.toLowerCase();
      const name = (r.child_name || "").toLowerCase();
      const explorer = (r.explorer_no || "").toLowerCase();

      if (!name.includes(s) && !explorer.includes(s)) {
        return false;
      }
    }

    if (filterBarangay && (r.barangay || "") !== filterBarangay) {
      return false;
    }

    if (filterSex && (r.sex || "") !== filterSex) {
      return false;
    }

    return true;
  });

  const barangays = Array.from(
    new Set(
      registrations
        .map((r) => r.barangay)
        .filter((barangay): barangay is string => Boolean(barangay))
    )
  ).sort((a, b) => a.localeCompare(b));

  /* =======================================================
     EXPORT REGISTRATION MASTERLIST TO EXCEL
  ======================================================= */

  function exportRegistrationMasterlist() {
    const sorted = [...registrations].sort((a, b) =>
      (a.explorer_no || "").localeCompare(
        b.explorer_no || "",
        undefined,
        { numeric: true }
      )
    );

    const rows = sorted.map((r, index) => ({
      "No.": index + 1,
      "Explorer No.": r.explorer_no || "",
      "Child's Name": r.child_name || "",
      Age: r.age ?? "",
      Sex: r.sex || "",
      Birthdate: r.birthdate || "",
      Barangay: r.barangay || "",
      "Parent/Guardian": r.parent_name || "",
      "Contact Number": r.contact_number || "",
      "Checked In": r.checked_in ? "Yes" : "No",
      "Registered At": r.created_at
        ? new Date(r.created_at).toLocaleString()
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 30 },
      { wch: 8 },
      { wch: 12 },
      { wch: 14 },
      { wch: 20 },
      { wch: 30 },
      { wch: 18 },
      { wch: 12 },
      { wch: 24 },
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Registration Masterlist"
    );

    XLSX.writeFile(
      workbook,
      "Claver-Childrens-Festival-2026-Registration-Masterlist.xlsx"
    );
  }

  /* =======================================================
     PRINT SAFARI EXPLORER KIT ACKNOWLEDGMENT RECEIPT
  ======================================================= */

  function printSafariKitAcknowledgment() {
    const sorted = [...registrations].sort((a, b) =>
      (a.explorer_no || "").localeCompare(
        b.explorer_no || "",
        undefined,
        { numeric: true }
      )
    );

    if (sorted.length === 0) {
      alert("There are no registrations to print.");
      return;
    }

    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const rows = sorted
      .map(
        (r, index) => `
          <tr>
            <td class="center">${index + 1}</td>
            <td class="center explorer">
              ${escapeHtml(r.explorer_no || "")}
            </td>
            <td>
              ${escapeHtml(r.child_name || "")}
            </td>
            <td class="center">
              ${r.age ?? ""}
            </td>
            <td>
              ${escapeHtml(r.barangay || "")}
            </td>
            <td>
              ${escapeHtml(r.parent_name || "")}
            </td>
            <td class="signature"></td>
          </tr>
        `
      )
      .join("");

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert(
        "Please allow pop-ups in your browser to print the acknowledgment receipt."
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Safari Explorer Kit Acknowledgment Receipt</title>

          <style>
            @page {
              size: A4 landscape;
              margin: 10mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              color: #000;
              font-size: 10pt;
            }

            .header {
              text-align: center;
              margin-bottom: 12px;
            }

            .header h1 {
              margin: 0;
              font-size: 18pt;
              font-weight: 800;
            }

            .header h2 {
              margin: 4px 0 0;
              font-size: 15pt;
              font-weight: 800;
            }

            .header p {
              margin: 5px 0 0;
              font-size: 10pt;
            }

            .statement {
              margin: 12px 0 14px;
              text-align: justify;
              line-height: 1.4;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
            }

            thead {
              display: table-header-group;
            }

            tr {
              page-break-inside: avoid;
            }

            th,
            td {
              border: 1px solid #000;
              padding: 5px 6px;
              vertical-align: middle;
            }

            th {
              text-align: center;
              font-weight: 700;
              background: #eeeeee;
            }

            tbody td {
              height: 38px;
            }

            .center {
              text-align: center;
            }

            .explorer {
              font-weight: 700;
            }

            .col-no {
              width: 5%;
            }

            .col-explorer {
              width: 13%;
            }

            .col-child {
              width: 21%;
            }

            .col-age {
              width: 6%;
            }

            .col-barangay {
              width: 15%;
            }

            .col-parent {
              width: 22%;
            }

            .col-signature {
              width: 18%;
            }

            .signature {
              height: 38px;
            }

            .footer-note {
              margin-top: 8px;
              font-size: 8pt;
              font-style: italic;
            }

            @media print {
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <h1>CLAVER CHILDREN'S FESTIVAL</h1>
            <h2>SAFARI EXPLORER KIT – ACKNOWLEDGMENT RECEIPT</h2>
            <p>
              September 5, 2026 | Claver Sports Complex Grounds
            </p>
          </div>

          <div class="statement">
            I hereby acknowledge receipt of the
            <strong>Safari Explorer Kit</strong> issued to the
            registered child indicated below during the
            <strong>
              Panaghiusa Festival 2026 – Claver Children's Festival
            </strong>.
          </div>

          <table>
            <thead>
              <tr>
                <th class="col-no">No.</th>
                <th class="col-explorer">Explorer No.</th>
                <th class="col-child">Child's Name</th>
                <th class="col-age">Age</th>
                <th class="col-barangay">Barangay</th>
                <th class="col-parent">Parent/Guardian</th>
                <th class="col-signature">Signature</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>
          </table>

          <p class="footer-note">
            Signature confirms receipt of the Safari Explorer Kit.
          </p>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }


  /* =======================================================
     VIEW / PRINT WAIVER & CONSENT RECORD
  ======================================================= */

  function viewWaiver(r: Registration) {
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const yesNo = (value?: boolean) =>
      value ? "✓ ACCEPTED" : "NOT ACCEPTED";

    const acceptedAt = r.waiver_accepted_at
      ? new Date(r.waiver_accepted_at).toLocaleString()
      : "Not available";

    const waiverText = r.waiver_full_text
      ? escapeHtml(r.waiver_full_text).replace(/\n/g, "<br />")
      : "The full waiver text was not stored for this registration.";

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert(
        "Please allow pop-ups in your browser to view the waiver and consent record."
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />

          <title>
            Waiver - ${escapeHtml(r.explorer_no || "Registration")}
          </title>

          <style>
            @page {
              size: A4;
              margin: 15mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              color: #111827;
              background: #f3f4f6;
              font-family: Arial, Helvetica, sans-serif;
              line-height: 1.5;
            }

            .toolbar {
              position: sticky;
              top: 0;
              z-index: 10;
              display: flex;
              justify-content: center;
              gap: 10px;
              padding: 14px;
              background: #14532d;
            }

            .toolbar button {
              border: 0;
              border-radius: 999px;
              padding: 11px 20px;
              font-weight: 700;
              cursor: pointer;
            }

            .print-button {
              color: white;
              background: #15803d;
              border: 1px solid rgba(255,255,255,.35) !important;
            }

            .close-button {
              color: #14532d;
              background: #facc15;
            }

            .document {
              width: min(900px, calc(100% - 28px));
              margin: 24px auto;
              padding: 34px;
              background: white;
              box-shadow: 0 10px 35px rgba(0,0,0,.12);
            }

            .header {
              text-align: center;
              border-bottom: 2px solid #166534;
              padding-bottom: 18px;
            }

            .header h1,
            .header h2,
            .header p {
              margin: 0;
            }

            .header h1 {
              color: #166534;
              font-size: 22px;
              font-weight: 800;
            }

            .header h2 {
              margin-top: 6px;
              font-size: 18px;
            }

            .header p {
              margin-top: 6px;
              font-size: 13px;
              color: #4b5563;
            }

            .section {
              margin-top: 24px;
            }

            .section-title {
              margin: 0 0 10px;
              padding: 9px 12px;
              color: #14532d;
              background: #dcfce7;
              border-left: 5px solid #16a34a;
              font-size: 15px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: .04em;
            }

            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 10px 22px;
            }

            .info-item {
              border-bottom: 1px solid #e5e7eb;
              padding: 7px 0;
            }

            .label {
              display: block;
              color: #6b7280;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: .04em;
            }

            .value {
              display: block;
              margin-top: 2px;
              font-weight: 700;
            }

            .notice {
              margin-top: 10px;
              padding: 14px;
              border: 1px solid #bfdbfe;
              border-radius: 10px;
              background: #eff6ff;
              font-size: 13px;
            }

            .bisaya {
              margin-top: 9px;
              padding: 10px 12px;
              border-radius: 8px;
              color: #14532d;
              background: #f0fdf4;
              font-size: 12.5px;
              font-style: italic;
            }

            .ack {
              margin-top: 10px;
              border: 1px solid #d1d5db;
              border-radius: 10px;
              overflow: hidden;
            }

            .ack-head {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 14px;
              padding: 10px 12px;
              background: #f9fafb;
              font-weight: 800;
            }

            .accepted {
              white-space: nowrap;
              color: #166534;
            }

            .not-accepted {
              white-space: nowrap;
              color: #b91c1c;
            }

            .ack-body {
              padding: 12px;
              font-size: 13px;
            }

            .stored-waiver {
              margin-top: 12px;
              padding: 14px;
              border: 1px solid #d1d5db;
              border-radius: 10px;
              background: #fafafa;
              font-size: 12.5px;
              white-space: normal;
            }

            .record-note {
              margin-top: 24px;
              padding-top: 14px;
              border-top: 1px solid #d1d5db;
              color: #4b5563;
              font-size: 11px;
            }

            @media (max-width: 640px) {
              .document {
                padding: 20px;
              }

              .info-grid {
                grid-template-columns: 1fr;
              }
            }

            @media print {
              body {
                background: white;
              }

              .toolbar {
                display: none !important;
              }

              .document {
                width: 100%;
                margin: 0;
                padding: 0;
                box-shadow: none;
              }

              .ack,
              .notice,
              .section {
                break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          <div class="toolbar">
            <button
              class="print-button"
              onclick="window.print()"
            >
              🖨 Print / Save as PDF
            </button>

            <button
              class="close-button"
              onclick="window.close()"
            >
              Close
            </button>
          </div>

          <main class="document">
            <header class="header">
              <h1>CLAVER CHILDREN'S FESTIVAL</h1>
              <h2>PARENT / GUARDIAN WAIVER, CONSENT & ACKNOWLEDGMENT</h2>
              <p>
                Panaghiusa Festival 2026 • September 5, 2026 •
                Claver Sports Complex Grounds
              </p>
            </header>

            <section class="section">
              <h3 class="section-title">Registration Information</h3>

              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Explorer Number</span>
                  <span class="value">
                    ${escapeHtml(r.explorer_no || "—")}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Child's Name</span>
                  <span class="value">
                    ${escapeHtml(r.child_name || "—")}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Age</span>
                  <span class="value">
                    ${r.age ?? "—"}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Barangay</span>
                  <span class="value">
                    ${escapeHtml(r.barangay || "—")}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Parent / Guardian</span>
                  <span class="value">
                    ${escapeHtml(
                      r.waiver_signatory_name ||
                      r.parent_name ||
                      "—"
                    )}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Relationship to Child</span>
                  <span class="value">
                    ${escapeHtml(r.waiver_relationship || "—")}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Date / Time Accepted</span>
                  <span class="value">
                    ${escapeHtml(acceptedAt)}
                  </span>
                </div>

                <div class="info-item">
                  <span class="label">Waiver Version</span>
                  <span class="value">
                    ${escapeHtml(r.waiver_version || "—")}
                  </span>
                </div>
              </div>
            </section>

            <section class="section">
              <h3 class="section-title">Pre-Registration Notice</h3>

              <div class="notice">
                Pre-registration helps the organizers estimate the expected
                number of children, prepare event logistics and resources,
                and facilitate a faster and more organized check-in process
                on the day of the festival. Upon successful registration, an
                Explorer Number is issued and may be used for QR-based
                verification and faster check-in at the venue.

                <div class="bisaya">
                  <strong>Bisaya:</strong>
                  Ang pre-registration makatabang sa mga organizers sa
                  pagbanabana sa gidaghanon sa mga bata nga motambong,
                  sa pag-andam sa mga kinahanglanon ug resources sa kalihokan,
                  ug sa pagpahapsay ug pagpadasig sa check-in sa adlaw sa
                  festival. Human sa malampusong registration, hatagan ang
                  bata og Explorer Number nga mahimong gamiton sa QR-based
                  verification ug mas paspas nga check-in sa venue.
                </div>
              </div>
            </section>

            <section class="section">
              <h3 class="section-title">
                Parent / Guardian Waiver & Consent Responses
              </h3>

              <div class="ack">
                <div class="ack-head">
                  <span>1. Certification of Registration Information</span>
                  <span class="${r.certification_accepted ? "accepted" : "not-accepted"}">
                    ${yesNo(r.certification_accepted)}
                  </span>
                </div>
                <div class="ack-body">
                  I certify that the information provided in this registration
                  is true and correct to the best of my knowledge and that I am
                  the parent, legal guardian, or duly authorized adult
                  responsible for the child being registered.

                  <div class="bisaya">
                    <strong>Bisaya:</strong>
                    Gipamatud-an nako nga tinuod ug husto ang mga impormasyon
                    nga akong gihatag niini nga registration sumala sa akong
                    nahibaloan, ug ako ang ginikanan, legal guardian, o
                    awtorisadong hamtong nga responsable sa bata nga gi-register.
                  </div>
                </div>
              </div>

              <div class="ack">
                <div class="ack-head">
                  <span>2. Participation Consent</span>
                  <span class="${r.participation_consent ? "accepted" : "not-accepted"}">
                    ${yesNo(r.participation_consent)}
                  </span>
                </div>
                <div class="ack-body">
                  I voluntarily give permission for the child named in this
                  registration to participate in the Claver Children's
                  Festival – Safari Adventure.

                  <div class="bisaya">
                    <strong>Bisaya:</strong>
                    Boluntaryo nakong gitugotan ang bata nga nakapangalan
                    niini nga registration nga moapil sa Claver Children's
                    Festival – Safari Adventure.
                  </div>
                </div>
              </div>

              <div class="ack">
                <div class="ack-head">
                  <span>3. Risk Acknowledgment</span>
                  <span class="${r.risk_acknowledgment ? "accepted" : "not-accepted"}">
                    ${yesNo(r.risk_acknowledgment)}
                  </span>
                </div>
                <div class="ack-body">
                  I understand that the event includes recreational,
                  educational, interactive, entertainment, and child-oriented
                  activities, and that ordinary risks may be associated with
                  participation in these activities.

                  <div class="bisaya">
                    <strong>Bisaya:</strong>
                    Nasabtan nako nga adunay mga dula, educational ug
                    interactive activities, kalingawan, ug uban pang
                    kalihokan para sa mga bata, ug adunay kasagarang risgo
                    nga mahimong kauban sa pag-apil niini nga mga kalihokan.
                  </div>
                </div>
              </div>

              <div class="ack">
                <div class="ack-head">
                  <span>4. Safety Rules & Event Guidelines</span>
                  <span class="${r.safety_rules_accepted ? "accepted" : "not-accepted"}">
                    ${yesNo(r.safety_rules_accepted)}
                  </span>
                </div>
                <div class="ack-body">
                  I agree to comply with event guidelines, safety instructions,
                  and the directions of authorized event personnel.

                  <div class="bisaya">
                    <strong>Bisaya:</strong>
                    Mouyon ko nga sundon ang mga lagda sa event, safety
                    instructions, ug mga panudlo sa awtorisadong personnel
                    sa kalihokan.
                  </div>
                </div>
              </div>

              <div class="ack">
                <div class="ack-head">
                  <span>5. Emergency Assistance Consent</span>
                  <span class="${r.emergency_consent ? "accepted" : "not-accepted"}">
                    ${yesNo(r.emergency_consent)}
                  </span>
                </div>
                <div class="ack-body">
                  In case of an emergency, I authorize the event organizers,
                  designated personnel, and medical responders to provide
                  appropriate first aid and/or facilitate necessary medical
                  assistance when reasonably required.

                  <div class="bisaya">
                    <strong>Bisaya:</strong>
                    Kung adunay emergency, gitugotan nako ang organizers,
                    designated personnel, ug medical responders nga mohatag
                    og angay nga first aid ug/o motabang sa pagpa-medical
                    assistance kung gikinahanglan.
                  </div>
                </div>
              </div>

              <div class="ack">
                <div class="ack-head">
                  <span>6. Full Waiver Acceptance</span>
                  <span class="${r.full_waiver_accepted ? "accepted" : "not-accepted"}">
                    ${yesNo(r.full_waiver_accepted)}
                  </span>
                </div>
                <div class="ack-body">
                  I confirm that I have read and understood the Parent/Guardian
                  Waiver, Consent & Acknowledgment, including the Bisaya
                  explanations provided for clarity, and I voluntarily agree
                  to its terms.

                  <div class="bisaya">
                    <strong>Bisaya:</strong>
                    Gipamatud-an nako nga akong nabasa ug nasabtan ang
                    Parent/Guardian Waiver, Consent & Acknowledgment, apil ang
                    Bisaya nga pagpasabot aron mas klaro, ug boluntaryo akong
                    mouyon sa mga kondisyon niini.
                  </div>
                </div>
              </div>
            </section>

            <section class="section">
              <h3 class="section-title">Safari Explorer Kit Notice</h3>

              <div class="notice">
                Safari Explorer Kits are available while supplies last.
                Pre-registration does not guarantee or reserve a Safari
                Explorer Kit. Kits will be distributed only at the event
                venue on a first-come, first-served basis while supplies
                are available. The registered child must be physically
                present at the venue to claim the kit.

                <div class="bisaya">
                  <strong>Bisaya:</strong>
                  Ang Safari Explorer Kits ihatag samtang adunay available
                  nga supply. Ang pre-registration dili garantiya ug dili usab
                  reservation sa Safari Explorer Kit. Ang mga kit ihatag lamang
                  didto sa venue sa adlaw sa kalihokan base sa first-come,
                  first-served basis samtang adunay available nga supply.
                  Kinahanglan nga personal nga naa ang registered nga bata sa
                  venue aron makadawat sa kit.
                </div>
              </div>

              <div class="ack">
                <div class="ack-head">
                  <span>Safari Explorer Kit Acknowledgment</span>
                  <span class="${r.kit_disclaimer_accepted ? "accepted" : "not-accepted"}">
                    ${yesNo(r.kit_disclaimer_accepted)}
                  </span>
                </div>

                <div class="ack-body">
                  I understand that pre-registration does not guarantee a
                  Safari Explorer Kit and that kits will be distributed at
                  the venue on a first-come, first-served basis while
                  supplies last.

                  <div class="bisaya">
                    <strong>Bisaya:</strong>
                    Nasabtan nako nga ang pre-registration dili garantiya
                    nga makadawat og Safari Explorer Kit ug nga ang mga kit
                    ihatag sa venue base sa first-come, first-served basis
                    samtang adunay available nga supply.
                  </div>
                </div>
              </div>
            </section>

            <section class="section">
              <h3 class="section-title">
                Stored Waiver Record
              </h3>

              <div class="stored-waiver">
                ${waiverText}
              </div>
            </section>

            <p class="record-note">
              This document is generated from the electronic registration
              record stored for Explorer Number
              <strong>${escapeHtml(r.explorer_no || "—")}</strong>.
              The acceptance status, signatory information, waiver version,
              and acceptance timestamp shown above are reproduced from the
              registration record.
            </p>
          </main>
        </body>
      </html>
    `);

    printWindow.document.close();
  }

  /* =======================================================
     DELETE INVALID / UNREALISTIC REGISTRATION
  ======================================================= */

  async function deleteRegistration(r: Registration) {
    const explorer = r.explorer_no || `ID ${r.id}`;
    const child = r.child_name || "Unnamed child";

    const firstConfirmation = window.confirm(
      `Delete this registration?\n\nExplorer: ${explorer}\nChild: ${child}\n\nThis will permanently remove this registration and its saved waiver/consent record.`
    );

    if (!firstConfirmation) {
      return;
    }

    const typedConfirmation = window.prompt(
      `For safety, type DELETE to permanently remove ${explorer}.`
    );

    if (typedConfirmation !== "DELETE") {
      if (typedConfirmation !== null) {
        alert("Deletion cancelled. You must type DELETE exactly.");
      }
      return;
    }

    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", r.id);

    if (error) {
      console.error("Delete registration error:", error);

      alert(
        `Unable to delete this registration.\n\n${error.message}`
      );
      return;
    }

    setRegistrations((current) =>
      current.filter((item) => item.id !== r.id)
    );

    alert(
      `${explorer} - ${child} was permanently deleted.`
    );
  }

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = useMemo(() => {
    const totalCount = registrations.length;

    const checkedInCount = registrations.filter(
      (r) => r.checked_in
    ).length;

    const pendingCount = totalCount - checkedInCount;

    const barangayCounts = new Map<string, number>();
    const genderCounts = new Map<string, number>();
    const ageCounts = new Map<number, number>();
    const dailyCounts = new Map<string, number>();

    for (const r of registrations) {
      const barangayName = r.barangay || "Not in Claver";

      barangayCounts.set(
        barangayName,
        (barangayCounts.get(barangayName) || 0) + 1
      );

      const genderName = r.sex || "Unspecified";

      genderCounts.set(
        genderName,
        (genderCounts.get(genderName) || 0) + 1
      );

      if (typeof r.age === "number") {
        ageCounts.set(
          r.age,
          (ageCounts.get(r.age) || 0) + 1
        );
      }

      const day = r.created_at
        ? new Date(r.created_at).toLocaleDateString()
        : "Unknown";

      dailyCounts.set(
        day,
        (dailyCounts.get(day) || 0) + 1
      );
    }

    const byBarangay = Array.from(
      barangayCounts.entries()
    )
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const byGender = Array.from(
      genderCounts.entries()
    ).map(([name, value]) => ({
      name,
      value,
    }));

    const byAge = Array.from(
      ageCounts.entries()
    )
      .map(([age, count]) => ({
        age: `${age}`,
        count,
      }))
      .sort(
        (a, b) =>
          Number(a.age) - Number(b.age)
      );

    const byDay = Array.from(
      dailyCounts.entries()
    )
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

    return {
      totalCount,
      checkedInCount,
      pendingCount,
      byBarangay,
      byGender,
      byAge,
      byDay,
    };
  }, [registrations]);

  return (
    <div>
      <AdminDashboardCharts
        data={chartData}
        loading={loading}
      />

      {/* ===================================================
          EXPORT / PRINT BUTTONS
      =================================================== */}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={exportRegistrationMasterlist}
          disabled={registrations.length === 0}
          className="rounded-xl bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          📊 Export Registration Masterlist
        </button>

        <button
          type="button"
          onClick={printSafariKitAcknowledgment}
          disabled={registrations.length === 0}
          className="rounded-xl bg-yellow-400 px-5 py-3 font-bold text-green-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          🖨 Print Safari Explorer Kit Acknowledgment Receipt
        </button>
      </div>

      {/* ===================================================
          SEARCH AND FILTERS
      =================================================== */}

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or explorer no"
            className="w-full rounded-xl border p-3"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filterBarangay}
            onChange={(e) => setFilterBarangay(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="">
              All Barangays
            </option>

            {barangays.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={filterSex}
            onChange={(e) => setFilterSex(e.target.value)}
            className="rounded-xl border p-3"
          >
            <option value="">
              All Sex
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>
          </select>
        </div>
      </div>

      {/* ===================================================
          REGISTRATION TABLE
      =================================================== */}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-4 shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="p-3">
                Reg ID
              </th>

              <th className="p-3">
                Explorer No
              </th>

              <th className="p-3">
                Child
              </th>

              <th className="p-3">
                Age
              </th>

              <th className="p-3">
                Sex
              </th>

              <th className="p-3">
                Birthdate
              </th>

              <th className="p-3">
                Barangay
              </th>

              <th className="p-3">
                Parent/Guardian
              </th>

              <th className="p-3">
                Contact
              </th>

              <th className="p-3">
                Registered At
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={12}
                  className="p-6 text-center"
                >
                  Loading…
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={12}
                  className="p-6 text-center"
                >
                  No registrations found.
                </td>
              </tr>
            )}

            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-t"
              >
                <td className="p-3 align-top">
                  {r.id}
                </td>

                <td className="p-3 align-top font-semibold text-green-800">
                  {r.explorer_no ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.child_name}
                </td>

                <td className="p-3 align-top">
                  {r.age ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.sex ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.birthdate ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.barangay ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.parent_name ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.contact_number ?? "—"}
                </td>

                <td className="p-3 align-top">
                  {r.created_at
                    ? new Date(
                        r.created_at
                      ).toLocaleString()
                    : "—"}
                </td>

                <td className="p-3 align-top">
                  {r.checked_in ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                      Checked In
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                      Pending
                    </span>
                  )}
                </td>

                <td className="p-3 align-top">
                  <div className="flex min-w-[170px] flex-col gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                      onClick={() =>
                        alert(
                          JSON.stringify(
                            r,
                            null,
                            2
                          )
                        )
                      }
                    >
                      👁 View
                    </button>

                    <button
                      type="button"
                      className="rounded-lg bg-green-700 px-3 py-2 font-semibold text-white hover:bg-green-800"
                      onClick={() => viewWaiver(r)}
                    >
                      📄 View Waiver
                    </button>

                    <button
                      type="button"
                      className="rounded-lg bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-700"
                      onClick={() =>
                        void deleteRegistration(r)
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}