import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../css/app.css"; // pastikan variabel css kamu terimport

const CustomDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="flex flex-col items-start gap-2">
      <label className="text-os-primary text-os-regular font-semibold">
        Pilih Tanggal
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        className="w-60 px-3 py-2 rounded-md border border-os-primary focus:outline-none focus:ring-2 focus:ring-os-primary text-os-black"
        placeholderText="Pilih tanggal..."
      />
    </div>
  );
};

export default CustomDatePicker;
