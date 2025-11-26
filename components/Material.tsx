import React from 'react';

const Material: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">Dasar Teori & Praktik Pengukuran Tegangan Tinggi</h2>
        <p className="text-slate-600 max-w-3xl mx-auto">
          Eksplorasi mendalam mengenai fenomena tegangan tinggi, mulai dari definisi, klasifikasi, aplikasi, hingga teknik pengukuran presisi menggunakan standar internasional.
        </p>
      </div>

      {/* --- NEW SECTION: Definisi & Klasifikasi --- */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.586l4 4a1 1 0 01.586 1.414V19a2 2 0 01-2 2z" />
           </svg>
           Klasifikasi Tegangan (Standar IEC)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Istilah</th>
                <th className="px-6 py-3">Rentang Tegangan (AC RMS)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">LV</td>
                <td className="px-6 py-4">Low Voltage (Tegangan Rendah)</td>
                <td className="px-6 py-4">&le; 1 kV</td>
              </tr>
              <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-yellow-600">MV</td>
                <td className="px-6 py-4">Medium Voltage (Tegangan Menengah)</td>
                <td className="px-6 py-4">1 kV - 35 kV</td>
              </tr>
              <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-orange-600">HV</td>
                <td className="px-6 py-4">High Voltage (Tegangan Tinggi)</td>
                <td className="px-6 py-4">35 kV - 245 kV</td>
              </tr>
              <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-red-600">EHV</td>
                <td className="px-6 py-4">Extra High Voltage (Tegangan Ekstra Tinggi)</td>
                <td className="px-6 py-4">245 kV - 800 kV</td>
              </tr>
              <tr className="bg-white hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-purple-600">UHV</td>
                <td className="px-6 py-4">Ultra High Voltage (Tegangan Ultra Tinggi)</td>
                <td className="px-6 py-4">&gt; 800 kV</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* --- NEW SECTION: Jenis-Jenis Tegangan Tinggi --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* HVAC */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Tegangan Tinggi AC</h4>
            <p className="text-sm text-slate-600 mb-4 text-justify">
               Jenis paling umum digunakan untuk transmisi & distribusi daya. Diuji pada frekuensi jala-jala (50/60 Hz).
            </p>
            <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside bg-slate-50 p-3 rounded-lg">
               <li><strong>Pembangkit:</strong> Trafo Uji (Testing Transformer).</li>
               <li><strong>Aplikasi:</strong> Pengujian isolator, transmisi listrik PLN.</li>
            </ul>
         </div>

         {/* HVDC */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
               </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Tegangan Tinggi DC</h4>
            <p className="text-sm text-slate-600 mb-4 text-justify">
               Digunakan untuk transmisi jarak jauh (HVDC) dan penelitian fisika. Memiliki riak (ripple) tegangan yang minim.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside bg-slate-50 p-3 rounded-lg">
               <li><strong>Pembangkit:</strong> Rangkaian Cockcroft-Walton, Penyearah.</li>
               <li><strong>Aplikasi:</strong> Kabel bawah laut, Elektrostatik Precipitator.</li>
            </ul>
         </div>

         {/* Impulse */}
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center mb-4 text-violet-600">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
               </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-2">Tegangan Impuls</h4>
            <p className="text-sm text-slate-600 mb-4 text-justify">
               Simulasi gangguan sesaat seperti sambaran petir (1.2/50 µs) atau surja hubung (switching surge).
            </p>
            <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside bg-slate-50 p-3 rounded-lg">
               <li><strong>Pembangkit:</strong> Generator Marx.</li>
               <li><strong>Aplikasi:</strong> Uji ketahanan peralatan terhadap petir.</li>
            </ul>
         </div>
      </section>

      {/* --- NEW SECTION: Aplikasi --- */}
      <section className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
         <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-blue-400">Aplikasi Teknologi Tegangan Tinggi</h3>
                <p className="text-slate-300 text-sm leading-relaxed text-justify">
                    Teknologi tegangan tinggi tidak hanya terbatas pada sistem tenaga listrik. Ia menjadi tulang punggung bagi berbagai inovasi modern di bidang industri, medis, dan penelitian ilmiah tingkat lanjut.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <h5 className="font-bold text-emerald-400 text-sm mb-1">Industri</h5>
                        <p className="text-xs text-slate-400">Penyaring debu (Electrostatic Precipitator), Pengecatan mobil (Spray Painting), X-ray Inspection.</p>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <h5 className="font-bold text-pink-400 text-sm mb-1">Medis</h5>
                        <p className="text-xs text-slate-400">Pembangkitan Sinar-X (Rontgen), Terapi radiasi kanker, Sterilisasi plasma.</p>
                    </div>
                     <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <h5 className="font-bold text-yellow-400 text-sm mb-1">Sains</h5>
                        <p className="text-xs text-slate-400">Akselerator partikel (CERN), Mikroskop Elektron, Eksperimen fusi nuklir.</p>
                    </div>
                     <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <h5 className="font-bold text-cyan-400 text-sm mb-1">Pangan</h5>
                        <p className="text-xs text-slate-400">Pasteurisasi non-termal (Pulsed Electric Field) untuk membunuh bakteri tanpa merusak nutrisi.</p>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative w-48 h-48">
                    <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                    <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full">
                        <path d="M100 20 L120 80 L180 80 L130 120 L150 180 L100 140 L50 180 L70 120 L20 80 L80 80 Z" fill="none" stroke="#60a5fa" strokeWidth="2" />
                        <circle cx="100" cy="100" r="30" fill="#3b82f6" opacity="0.8" />
                        <circle cx="100" cy="100" r="50" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_10s_linear_infinite]" />
                        <circle cx="100" cy="100" r="70" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 4" className="animate-[spin_15s_linear_infinite_reverse]" />
                    </svg>
                </div>
            </div>
         </div>
      </section>

      {/* Safety First Section */}
      <section className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm">
        <h3 className="text-xl font-bold text-red-800 flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Prosedur Keselamatan (K3) Tegangan Tinggi
        </h3>
        <ul className="list-disc list-inside space-y-2 text-red-900 text-sm md:text-base">
            <li><strong>Grounding Stick:</strong> Selalu gunakan tongkat pentanahan untuk membuang muatan sisa kapasitor sebelum menyentuh rangkaian.</li>
            <li><strong>Jarak Aman (Clearance):</strong> Pastikan jarak aman minimum terpenuhi (biasanya 1 cm per 1 kV di udara) untuk mencegah flashover.</li>
            <li><strong>Sistem Interlock:</strong> Pintu area pengujian harus memiliki interlock yang memutus sumber tegangan saat pintu terbuka.</li>
            <li><strong>Sepatu Isolasi:</strong> Gunakan APD (Alat Pelindung Diri) yang sesuai standar tegangan kerja.</li>
        </ul>
      </section>

      {/* Sphere Gap Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm">1</span>
              Selah Bola (Sphere Gap)
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm text-justify">
              Selah bola standar adalah metode kalibrasi primer menurut standar IEC 60052. Metode ini mengandalkan prinsip breakdown udara yang konsisten pada medan listrik seragam di antara dua bola logam.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-900 text-sm mb-2">Kelebihan</h4>
                    <ul className="list-disc list-inside text-xs text-blue-800 space-y-1">
                        <li>Dapat mengukur tegangan Puncak (Peak) secara langsung.</li>
                        <li>Sederhana dan kokoh secara mekanik.</li>
                        <li>Dapat digunakan untuk kalibrasi alat ukur lain.</li>
                        <li>Berlaku untuk AC, DC, dan Impuls.</li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Kekurangan</h4>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        <li>Pengukuran tidak kontinu (harus terjadi breakdown).</li>
                        <li>Sangat dipengaruhi kondisi atmosfer (Suhu, Tekanan, Kelembaban).</li>
                        <li>Memerlukan tabel koreksi standar.</li>
                        <li>Membakar permukaan elektroda setelah pemakaian lama.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 mt-2">
              <p className="font-bold mb-2">Rumus Koreksi Udara:</p>
              <p>Vs = V0 × δ (untuk sela pendek)</p>
              <p className="mt-2">Faktor Kerapatan Udara (δ):</p>
              <p>δ = (0.386 × P) / (273 + T)</p>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col items-center">
             <div className="bg-blue-50 rounded-xl p-6 mb-4 w-full flex justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                    <defs>
                        <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#e2e8f0" />
                            <stop offset="100%" stopColor="#475569" />
                        </radialGradient>
                    </defs>
                    <circle cx="100" cy="50" r="40" fill="url(#sphereGrad)" stroke="#334155" strokeWidth="1" />
                    <line x1="100" y1="10" x2="100" y2="0" stroke="#0f172a" strokeWidth="4" />
                    <circle cx="100" cy="150" r="40" fill="url(#sphereGrad)" stroke="#334155" strokeWidth="1" />
                    <line x1="100" y1="190" x2="100" y2="200" stroke="#0f172a" strokeWidth="4" />
                    <text x="150" y="100" fontSize="12" fill="#64748b">d (Gap)</text>
                    <line x1="145" y1="90" x2="145" y2="110" stroke="#64748b" strokeWidth="1" />
                    <line x1="100" y1="90" x2="140" y2="90" stroke="#cbd5e1" strokeDasharray="2 2" />
                    <line x1="100" y1="110" x2="140" y2="110" stroke="#cbd5e1" strokeDasharray="2 2" />
                </svg>
             </div>
             <p className="text-xs text-center text-slate-500 italic">
                Aplikasi: Kalibrasi voltmeter laboratorium, proteksi tegangan lebih (spark gap arrester).
             </p>
          </div>
        </div>
      </section>

      {/* Resistive Divider Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-emerald-700 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm">2</span>
              Pembagi Tegangan Resistif
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm text-justify">
              Metode ini menggunakan perbandingan resistor tegangan tinggi (R1) dan resistor ukur (R2). Sering digunakan untuk DC karena pada AC frekuensi tinggi, kapasitansi stray (parasitik) akan mengganggu akurasi pembagian tegangan.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-bold text-emerald-900 text-sm mb-2">Kelebihan</h4>
                    <ul className="list-disc list-inside text-xs text-emerald-800 space-y-1">
                        <li>Sangat akurat untuk pengukuran DC.</li>
                        <li>Konstruksi sederhana dan murah.</li>
                        <li>Respons waktu cepat (jika resistor non-induktif).</li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Kekurangan</h4>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        <li>Boros daya (Panas) karena arus mengalir terus menerus ($I^2R$).</li>
                        <li>Tidak cocok untuk AC frekuensi tinggi (efek kapasitansi stray).</li>
                        <li>Perubahan nilai resistansi akibat panas (Thermal Drift).</li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 mt-2">
              <p className="font-bold mb-2">Rumus Rasio:</p>
              <p>V_out = V_in × (R2 / (R1 + R2))</p>
              <p className="mt-2 text-red-600 font-bold">Peringatan Keamanan:</p>
              <p className="text-xs text-red-500">
                Pastikan V_out tidak melebihi rating alat ukur (biasanya max 100V). Jika R1 terlalu kecil, V_out akan melonjak berbahaya!
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="bg-emerald-50 rounded-xl p-6 mb-4 w-full flex justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                <rect x="90" y="20" width="20" height="80" fill="none" stroke="#047857" strokeWidth="2" rx="2" />
                <text x="120" y="60" fontSize="12" fill="#047857">R1 (HV)</text>
                <line x1="100" y1="0" x2="100" y2="20" stroke="#0f172a" strokeWidth="2" />
                <line x1="100" y1="100" x2="100" y2="120" stroke="#0f172a" strokeWidth="2" />
                <rect x="90" y="120" width="20" height="40" fill="none" stroke="#047857" strokeWidth="2" rx="2" />
                <text x="120" y="140" fontSize="12" fill="#047857">R2 (LV)</text>
                <line x1="100" y1="160" x2="100" y2="180" stroke="#0f172a" strokeWidth="2" />
                <line x1="80" y1="180" x2="120" y2="180" stroke="#0f172a" strokeWidth="2" />
                <line x1="100" y1="110" x2="160" y2="110" stroke="#0f172a" strokeWidth="2" />
                <circle cx="160" cy="110" r="3" fill="#0f172a" />
                <text x="165" y="115" fontSize="12" fill="#0f172a">V_out</text>
                </svg>
            </div>
            <p className="text-xs text-center text-slate-500 italic">
                Aplikasi: Pengukuran HVDC pada transmisi listrik, probe multimeter HV, eksperimen fisika elektrostatik.
            </p>
          </div>
        </div>
      </section>

      {/* Capacitive Divider Section */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 space-y-4">
            <h3 className="text-2xl font-bold text-violet-700 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm">3</span>
              Pembagi Tegangan Kapasitif
            </h3>
            <p className="text-slate-600 leading-relaxed text-sm text-justify">
              Ideal untuk pengukuran tegangan tinggi AC dan Impuls cepat. Menggunakan kapasitor gas bertekanan (SF6 atau Nitrogen) sebagai lengan tegangan tinggi (C1) untuk meminimalkan rugi-rugi dielektrik ($\tan \delta$).
            </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-violet-50 p-4 rounded-lg">
                    <h4 className="font-bold text-violet-900 text-sm mb-2">Kelebihan</h4>
                    <ul className="list-disc list-inside text-xs text-violet-800 space-y-1">
                        <li>Tidak menghasilkan panas (Lossless reactance).</li>
                        <li>Respon frekuensi sangat baik (cocok untuk gelombang impuls).</li>
                        <li>Dapat digabungkan dengan CVT (Capacitor Voltage Transformer).</li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-bold text-slate-900 text-sm mb-2">Kekurangan</h4>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                        <li>Tidak bisa digunakan untuk DC murni (karena $X_c = \infty$).</li>
                        <li>Kabel pengukuran mempengaruhi kapasitansi total (C2).</li>
                        <li>Muatan sisa tersimpan (Bahaya jika tidak di-grounding).</li>
                    </ul>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 mt-2">
              <p className="font-bold mb-2">Rumus Rasio:</p>
              <p>V_out = V_in × (C1 / (C1 + C2))</p>
              <p className="text-xs text-slate-500 mt-1 italic">
                *Tegangan berbanding terbalik dengan kapasitansi. C1 biasanya kecil (pF), C2 besar (uF).
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="bg-violet-50 rounded-xl p-6 mb-4 w-full flex justify-center">
                <svg viewBox="0 0 200 200" className="w-48 h-48">
                <line x1="100" y1="0" x2="100" y2="40" stroke="#0f172a" strokeWidth="2" />
                <line x1="80" y1="40" x2="120" y2="40" stroke="#7c3aed" strokeWidth="2" />
                <line x1="80" y1="50" x2="120" y2="50" stroke="#7c3aed" strokeWidth="2" />
                <line x1="100" y1="50" x2="100" y2="100" stroke="#0f172a" strokeWidth="2" />
                <text x="125" y="50" fontSize="12" fill="#7c3aed">C1</text>
                <line x1="100" y1="100" x2="100" y2="130" stroke="#0f172a" strokeWidth="2" />
                <line x1="80" y1="130" x2="120" y2="130" stroke="#7c3aed" strokeWidth="2" />
                <line x1="80" y1="140" x2="120" y2="140" stroke="#7c3aed" strokeWidth="2" />
                <line x1="100" y1="140" x2="100" y2="170" stroke="#0f172a" strokeWidth="2" />
                <text x="125" y="140" fontSize="12" fill="#7c3aed">C2</text>
                <line x1="80" y1="170" x2="120" y2="170" stroke="#0f172a" strokeWidth="2" />
                <line x1="100" y1="115" x2="160" y2="115" stroke="#0f172a" strokeWidth="2" />
                <circle cx="160" cy="115" r="3" fill="#0f172a" />
                <text x="165" y="120" fontSize="12" fill="#0f172a">V_out</text>
                </svg>
            </div>
             <p className="text-xs text-center text-slate-500 italic">
                Aplikasi: Gardu Induk (GIS), laboratorium pengujian impuls, deteksi partial discharge.
             </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Material;