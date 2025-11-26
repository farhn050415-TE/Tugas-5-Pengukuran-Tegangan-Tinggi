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
           Klasifikasi Tegangan (Standar PLN - SPLN)
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Di Indonesia, klasifikasi level tegangan diatur oleh standar PLN (SPLN 1:1995) dan PUIL:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3">Kategori</th>
                <th className="px-6 py-3">Singkatan</th>
                <th className="px-6 py-3">Rentang Tegangan Nominal</th>
                <th className="px-6 py-3">Contoh Aplikasi</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">Tegangan Rendah</td>
                <td className="px-6 py-4 font-bold text-blue-600">TR</td>
                <td className="px-6 py-4">220 V - 380 V (s.d 1 kV)</td>
                <td className="px-6 py-4">Pelanggan Rumah Tangga, Bisnis Kecil</td>
              </tr>
              <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">Tegangan Menengah</td>
                <td className="px-6 py-4 font-bold text-yellow-600">TM</td>
                <td className="px-6 py-4">1 kV - 35 kV (Umumnya 20 kV)</td>
                <td className="px-6 py-4">Jaringan Distribusi Primer, Industri</td>
              </tr>
              <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">Tegangan Tinggi</td>
                <td className="px-6 py-4 font-bold text-orange-600">TT</td>
                <td className="px-6 py-4">35 kV - 245 kV (Umumnya 70 kV, 150 kV)</td>
                <td className="px-6 py-4">Sub-transmisi, Gardu Induk (GI)</td>
              </tr>
               <tr className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-800">Tegangan Ekstra Tinggi</td>
                <td className="px-6 py-4 font-bold text-red-600">TET</td>
                <td className="px-6 py-4">&gt; 245 kV (Umumnya 275 kV, 500 kV)</td>
                <td className="px-6 py-4">Transmisi Utama Jarak Jauh (SUTET)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Section: Jenis Tegangan --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-xl font-bold text-slate-800 mb-4">Jenis Tegangan Tinggi</h3>
           <ul className="space-y-3 text-sm text-slate-600 list-disc pl-5">
             <li>
               <span className="font-bold text-slate-800">HV-AC (Alternating Current):</span>
               <p>Digunakan untuk transmisi daya efisien jarak jauh karena mudah ditransformasikan level tegangannya.</p>
             </li>
             <li>
               <span className="font-bold text-slate-800">HV-DC (Direct Current):</span>
               <p>Digunakan untuk transmisi bawah laut atau interkoneksi antar pulau karena rugi-rugi dielektrik yang lebih rendah.</p>
             </li>
             <li>
               <span className="font-bold text-slate-800">Tegangan Impuls:</span>
               <p>Tegangan transien durasi singkat (mikrodetik) seperti petir (lightning) atau switching surge. Penting untuk pengujian isolasi.</p>
             </li>
           </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-xl font-bold text-slate-800 mb-4">Aplikasi Utama</h3>
           <ul className="space-y-3 text-sm text-slate-600">
             <li className="flex gap-3">
               <div className="min-w-[4px] h-full bg-blue-500 rounded-full"></div>
               <div>
                 <span className="font-bold text-slate-800">Transmisi Daya Listrik:</span>
                 <p>Meminimalkan rugi-rugi daya (I²R) dengan menaikkan tegangan dan menurunkan arus.</p>
               </div>
             </li>
             <li className="flex gap-3">
               <div className="min-w-[4px] h-full bg-green-500 rounded-full"></div>
               <div>
                 <span className="font-bold text-slate-800">Industri & Penelitian:</span>
                 <p>Pemercepat partikel, tabung sinar-X, dan proses presipitasi elektrostatik (penyaring debu pabrik).</p>
               </div>
             </li>
              <li className="flex gap-3">
               <div className="min-w-[4px] h-full bg-purple-500 rounded-full"></div>
               <div>
                 <span className="font-bold text-slate-800">Pengujian Isolasi:</span>
                 <p>Menguji ketahanan peralatan (trafo, kabel, isolator) sebelum dipasang di jaringan.</p>
               </div>
             </li>
           </ul>
        </div>
      </section>

      {/* --- Section 2: Metode Pengukuran --- */}
      <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Metode Pengukuran Tegangan Tinggi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sela Bola */}
            <div className="space-y-3">
                <div className="h-40 bg-slate-100 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg"></div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg mt-12 -ml-4 border-4 border-slate-100"></div>
                </div>
                <h4 className="font-bold text-lg text-slate-800">1. Sela Bola (Sphere Gap)</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Standar primer untuk kalibrasi. Memanfaatkan fenomena breakdown udara. Sangat akurat untuk tegangan puncak (peak), namun dipengaruhi suhu dan tekanan udara.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2 border border-slate-100">
                    <p><span className="font-semibold text-green-600">Kelebihan:</span> Sederhana, andal, standar IEC 60052.</p>
                    <p><span className="font-semibold text-red-600">Kekurangan:</span> Tidak bisa merekam bentuk gelombang, perlu koreksi lingkungan.</p>
                </div>
            </div>

            {/* Resistif */}
            <div className="space-y-3">
                 <div className="h-40 bg-slate-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute w-1 h-24 bg-slate-400"></div>
                    <div className="z-10 bg-white border-2 border-slate-400 w-6 h-16 flex flex-col justify-between items-center p-1">
                        <div className="w-full h-0.5 bg-slate-200"></div>
                        <div className="w-full h-0.5 bg-slate-200"></div>
                        <div className="w-full h-0.5 bg-slate-200"></div>
                    </div>
                </div>
                <h4 className="font-bold text-lg text-slate-800">2. Pembagi Resistif</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Menggunakan resistor presisi tinggi. Cocok untuk tegangan DC dan AC frekuensi rendah. Terdiri dari Resistor HV (R1) dan LV (R2).
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2 border border-slate-100">
                    <p><span className="font-semibold text-green-600">Kelebihan:</span> Linieritas baik untuk DC, konstruksi stabil.</p>
                    <p><span className="font-semibold text-red-600">Kekurangan:</span> Disipasi panas (I²R), stray capacitance mengganggu di frekuensi tinggi.</p>
                </div>
            </div>

            {/* Kapasitif */}
            <div className="space-y-3">
                 <div className="h-40 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                    <div className="flex flex-col gap-1 items-center">
                        <div className="w-12 h-1 bg-slate-600"></div>
                        <div className="w-12 h-1 bg-slate-600 mb-2"></div>
                        <div className="w-1 h-8 bg-slate-400"></div>
                        <div className="w-12 h-1 bg-slate-600"></div>
                        <div className="w-12 h-1 bg-slate-600"></div>
                    </div>
                </div>
                <h4 className="font-bold text-lg text-slate-800">3. Pembagi Kapasitif</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Ideal untuk tegangan AC dan Impuls. Menggunakan reaktansi kapasitif (Xc). Tidak menghasilkan panas berlebih karena daya aktif nol.
                </p>
                <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2 border border-slate-100">
                    <p><span className="font-semibold text-green-600">Kelebihan:</span> Respons frekuensi tinggi bagus, rugi daya kecil.</p>
                    <p><span className="font-semibold text-red-600">Kekurangan:</span> Tidak bisa untuk DC murni (karena f=0, Xc=∞).</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- Section 3: Prosedur K3 --- */}
      <section className="bg-red-50 p-8 rounded-2xl shadow-sm border border-red-100">
        <h3 className="text-2xl font-bold text-red-800 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Prosedur Keselamatan (K3) Laboratorium
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-sm text-red-900">
                <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600">1.</span>
                    Grounding (Pentanahan) adalah wajib. Pastikan grounding stick terpasang sebelum menyentuh komponen rangkaian.
                </li>
                <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600">2.</span>
                    Jaga jarak aman (Clearance Distance) minimal sesuai level tegangan kerja (misal: 1cm per kV di udara).
                </li>
                <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600">3.</span>
                    Gunakan sepatu isolasi dan helm safety standar.
                </li>
            </ul>
            <ul className="space-y-3 text-sm text-red-900">
                 <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600">4.</span>
                    Dilarang bekerja sendirian (Buddy System) di area tegangan tinggi.
                </li>
                <li className="flex items-start gap-2">
                    <span className="font-bold text-red-600">5.</span>
                    Pastikan interlock pintu laboratorium berfungsi. Sumber tegangan harus mati otomatis jika pintu dibuka.
                </li>
            </ul>
        </div>
      </section>
    </div>
  );
};

export default Material;
