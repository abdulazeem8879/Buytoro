import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useAlert } from "../context/AlertContext";

const Contact = () => {
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await emailjs.send(
        "service_xxxxx",
        "template_yyyyy",
        form,
        "public_zzzzz"
      );

      showAlert("Message sent successfully!", "success");

      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      showAlert("Failed to send message", "error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Contact Support
      </h1>

      <form
        onSubmit={submitHandler}
        className="space-y-4 bg-white p-6 rounded-lg shadow"
      >
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          value={form.message}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
