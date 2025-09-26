import React, { useState } from "react";
import axios from "axios";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import leafIcon from "../assets/logo-icon.png";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // base API URL from .env
  const API = import.meta.env.VITE_API_URL;
  if (!API) {
    console.warn(" Missing VITE_API_URL in .env ...");
  }

  // simple validators (client-side UX)
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.message.trim().length < 10)
      e.message = "Message should be at least 10 characters";
    return e;
  };

  const onChange = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;

    setSubmitting(true);
    setSent(false);

    try {
      const res = await axios.post(
        `${API}/api/storecontact`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone || null, // optional
          message: form.message,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
      setErrors({});
    } catch (err) {
      if (err.response && err.response.status === 422) {
        const be = err.response.data?.errors || {};
        const normalized = {};
        Object.entries(be).forEach(([field, msgs]) => {
          normalized[field] = Array.isArray(msgs) ? msgs[0] : String(msgs);
        });
        setErrors(normalized);
      } else {
        setErrors((prev) => ({
          ...prev,
          form: "Something went wrong. Please try again.",
        }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (hasErr) =>
    `mt-1 w-full rounded-lg border bg-white px-4 py-3 focus:outline-none ${
      hasErr
        ? "border-red-500 focus:ring-2 focus:ring-red-500"
        : "border-gray-200 focus:ring-2 focus:ring-green-500"
    }`;

  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={leafIcon}
            alt=""
            className="h-24 w-24 mx-auto object-contain"
          />
          <h1 className="text-3xl md:text-4xl font-semibold text-green-900">
            Contact Us
          </h1>
          <p className="mt-2 text-gray-600">
            We’d love to hear from you. Send a message and we’ll reply shortly.
          </p>
        </div>

        {/* Map */}
        <div className="my-12 rounded-2xl overflow-hidden ring-1 ring-gray-100 shadow-sm bg-white">
          <iframe
            title="National Herbs Location"
            src="https://www.google.com/maps?q=Nayabazar,Sorakhutte,Kathmandu&output=embed"
            className="w-full h-80"
            loading="lazy"
          />
        </div>

        {/* Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            <InfoCard
              icon={<FaPhoneAlt />}
              title="Phone"
              lines={["+977 51-591457", "+977 51-591047"]}
              hrefs={["tel:+97751591457", "tel:+97751591047"]}
            />
            <InfoCard
              icon={<FaEnvelope />}
              title="Email"
              lines={["info@nationalherbs.com"]}
              hrefs={["mailto:info@nationalherbs.com"]}
            />
            <InfoCard
              icon={<FaMapMarkerAlt />}
              title="Address"
              lines={["Nayabazar, Sorakhutte", "Kathmandu, Nepal"]}
              hrefs={[
                "https://maps.google.com/?q=Nayabazar,Sorakhutte,Kathmandu",
              ]}
              external
            />
            <InfoCard
              icon={<FaClock />}
              title="Hours"
              lines={["Sun–Fri: 10:00 am – 6:00 pm", "Saturday: Closed"]}
            />
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-6 md:p-8">
              {sent && (
                <div className="mb-4 rounded-md bg-green-50 text-green-800 px-4 py-3">
                  Thank you! Your message has been received. We’ll be in touch.
                </div>
              )}
              {errors.form && (
                <div className="mb-4 rounded-md bg-red-50 text-red-700 px-4 py-3">
                  {errors.form}
                </div>
              )}

              <form
                onSubmit={onSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {/* Name */}
                <div>
                  <label className="text-sm text-gray-700">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your name"
                    className={inputClass(!!errors.name)}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    className={inputClass(!!errors.email)}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm text-gray-700">Phone (optional)</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="98XXXXXXXX"
                    className={inputClass(!!errors.phone)}
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Message */}
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    rows={5}
                    placeholder="Write your message..."
                    className={inputClass(!!errors.message)}
                  />
                  {errors.message && (
                    <p className="text-red-600 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <div className="md:col-span-2 flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    By submitting, you agree to be contacted by National Herbs.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`rounded-full text-white font-semibold px-6 py-3 transition ${
                      submitting
                        ? "bg-green-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* /Form */}
        </div>
      </div>
    </section>
  );
}

/* ---------- Small card component ---------- */
function InfoCard({ icon, title, lines, hrefs = [], external = false }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-green-600 text-white grid place-items-center">
          <span className="text-base">{icon}</span>
        </div>
        <h3 className="text-green-900 font-semibold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-1 text-gray-700">
        {lines.map((line, i) => {
          const href = hrefs[i];
          if (!href) return <li key={i}>{line}</li>;
          return external ? (
            <li key={i}>
              <a
                className="text-green-700 hover:underline"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {line}
              </a>
            </li>
          ) : (
            <li key={i}>
              <a className="text-green-700 hover:underline" href={href}>
                {line}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
