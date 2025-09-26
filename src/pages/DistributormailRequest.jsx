// src/pages/DistributormailRequest.jsx
import React, { useEffect } from "react";

// Build a Gmail compose URL (opens in new tab)
function gmailComposeLink(to, subject = "", body = "") {
  const base = "https://mail.google.com/mail/?view=cm&fs=1";
  const params = new URLSearchParams();
  if (to) params.set("to", to);
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `${base}&${params.toString()}`;
}

export default function DistributormailRequest() {
  useEffect(() => {
    const url = gmailComposeLink(
      "admin@gmail.com",
      "Distributor Partnership Inquiry — National Herbs",
      `Hello National Herbs Team,

I am interested in becoming an authorized distributor for National Herbs.

Company/Individual Name:
Location/City:
Phone:
Email:
Brief Background:
Target Market/Region:
Expected Monthly Volume:

Please let me know the process, requirements, and any documentation needed. I look forward to your response.

Best regards,
[Your Full Name]
[Your Company Name]
[Your Contact Number]`
    );

    window.location.href = url;
  }, []);

  return null;
}
