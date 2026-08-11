"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

const META = 120_000_000;
const WHATSAPP = "573217929578";

type Stats = {
  goal: number;
  total: number;
  familias: number;
  curso: number;
  constructores: number;
  otros: number;
};

const DEFAULT_STATS: Stats = {
  goal: META,
  total: 0,
  familias: 0,
  curso: 0,
  constructores: 0,
  otros: 0,
};

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export default function Home() {
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("familias");
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    const supabase = createSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc("get_campaign_progress");

    if (!error && data) {
      setStats({
        goal: Number(data.goal || META),
        total: Number(data.total || 0),
        familias: Number(data.familias || 0),
        curso: Number(data.curso || 0),
        constructores: Number(data.constructores || 0),
        otros: Number(data.otros || 0),
      });
    } else if (error) {
      console.error("Error obteniendo progreso:", error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  const progress = useMemo(
    () => Math.min(Math.round((stats.total / stats.goal) * 10000) / 100, 100),
    [stats]
  );

  function openWhatsApp() {
    const cleanAmount = Number(amount.replace(/\D/g, ""));

    if (!cleanAmount || cleanAmount < 1000) {
      alert("Escribe un valor de aporte válido.");
      return;
    }

    const categoryName =
      category === "familias"
        ? "Una familia, una semilla"
        : category === "curso"
        ? "Formación / Curso"
        : "Constructor";

    const message = `
Hola, quiero ser parte de *Construyamos Juntos — La Casa de Discípulos*.

Quiero realizar un aporte de *${money(cleanAmount)} COP*.

Forma de participar:
${categoryName}

Quiero recibir la información para realizar el aporte y posteriormente enviar mi comprobante.

¡Quiero construir juntos la Casa de Discípulos! 🏠
    `.trim();

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  }

  return (
    <main className="page">
      <nav className="nav">
        <div className="brand">
          <Image src="/images/logo-la-alianza.png" alt="La Alianza" width={52} height={52} />
          <div>
            <strong>CONSTRUYAMOS JUNTOS</strong>
            <span>La Casa de Discípulos</span>
          </div>
        </div>
        <a href="#aportar" className="navButton">Quiero construir</a>
      </nav>

      <section className="hero">
        <div className="heroText">
          <div className="eyebrow">LOMAS DE GRANADA · POPAYÁN</div>
          <h1>No estamos construyendo un edificio.<br /><em>Estamos construyendo una Casa de Discípulos.</em></h1>
          <p className="lead">Queremos adquirir el terreno donde construiremos una casa para formar discípulos, servir a nuestra comunidad y levantar nuevas generaciones que hagan discípulos.</p>

          <div className="progressCard">
            <div className="progressHeader">
              <span>Fondo Casa de Discípulos</span>
              <strong>{loading ? "..." : `${progress.toFixed(2)}%`}</strong>
            </div>
            <div className="progressBar"><div style={{ width: `${progress}%` }} /></div>
            <div className="moneyRow">
              <div><small>Hemos recaudado</small><b>{loading ? "..." : money(stats.total)}</b></div>
              <div><small>Meta inicial</small><b>{money(stats.goal)}</b></div>
            </div>
            <p className="smallText">Meta 2026 · Adquisición del terreno</p>
          </div>

          <div className="heroActions">
            <a href="#aportar" className="primaryButton">Quiero construir →</a>
            <a href="#vision" className="secondaryButton">Conocer la visión</a>
          </div>
        </div>

        <div className="heroImage">
          <Image src="/images/reunion-3.jpeg" alt="Familia de La Alianza reunida" fill priority sizes="(max-width: 900px) 100vw, 50vw" />
          <div className="imageBadge"><strong>Hoy</strong><span>nos reunimos en familia.</span></div>
        </div>
      </section>

      <section id="vision" className="section white">
        <div className="sectionIntro">
          <div className="eyebrow">UNA VISIÓN QUE CRECE</div>
          <h2>Primero conseguimos la tierra.<br /><em>Después construiremos juntos.</em></h2>
          <p>Buscamos adquirir un terreno amplio que permita desarrollar la visión de los próximos años. Comenzaremos con un auditorio para 100–200 personas y creceremos por etapas.</p>
        </div>
        <div className="visionGrid">
          <div className="visionCard"><span>01</span><h3>La tierra</h3><p>Un terreno pensado no solamente para hoy, sino para el crecimiento de la Casa de Discípulos.</p></div>
          <div className="visionCard"><span>02</span><h3>La primera Casa</h3><p>Un espacio inicial para 100–200 personas, discipulado, reuniones y servicio a la comunidad.</p></div>
          <div className="visionCard"><span>03</span><h3>La visión completa</h3><p>Una Casa de Discípulos capaz de formar, enviar y multiplicar generaciones.</p></div>
        </div>
      </section>

      <section className="story">
        <div className="storyImage"><Image src="/images/reunion-1.jpeg" alt="Comunidad de La Alianza" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
        <div className="storyText">
          <div className="eyebrow">ESTO YA ESTÁ SUCEDIENDO</div>
          <h2>La Casa no empieza cuando compremos el terreno.</h2>
          <p>La Casa ya comenzó. Está en cada conversación, cada familia, cada discípulo y cada persona que decide seguir a Jesús y ayudar a otra persona a seguirlo.</p>
          <p className="quote">“La iglesia no es un lugar al que vamos; es una familia a la que pertenecemos.”</p>
        </div>
      </section>

      <section id="aportar" className="section contribution">
        <div className="sectionIntro center">
          <div className="eyebrow">CONSTRUYAMOS JUNTOS</div>
          <h2>¿Cuánto quieres poner<br /><em>en esta Casa?</em></h2>
          <p>Elige un valor, cuéntanos cómo quieres participar y te contactaremos por WhatsApp para darte la información del aporte.</p>
        </div>

        <div className="contributionBox">
          <div className="amountOptions">
            {[20000, 50000, 100000, 500000, 1000000].map((value) => (
              <button key={value} type="button" onClick={() => setAmount(value.toString())} className={amount === value.toString() ? "amount active" : "amount"}>{money(value)}</button>
            ))}
          </div>

          <label>Otro valor</label>
          <div className="amountInput">
            <span>$</span>
            <input type="text" inputMode="numeric" placeholder="Escribe tu aporte" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
            <span>COP</span>
          </div>

          <label>Quiero participar como</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="familias">Una familia, una semilla</option>
            <option value="curso">Formación / Curso</option>
            <option value="constructores">Constructor</option>
          </select>

          <button type="button" className="whatsappButton" onClick={openWhatsApp}>Continuar por WhatsApp →</button>
          <p className="securityText">Tu aporte será confirmado antes de sumarse al contador público de la campaña.</p>
        </div>
      </section>

      <section className="section forms white">
        <div className="sectionIntro center"><div className="eyebrow">TRES FORMAS DE CONSTRUIR</div><h2>Todos podemos ser parte.</h2></div>
        <div className="cards">
          <div className="card"><span>01</span><h3>Una familia, una semilla</h3><p>Aporta semanalmente al Fondo Casa de Discípulos según lo que Dios ponga en tu corazón.</p></div>
          <div className="card"><span>02</span><h3>Forma un discípulo</h3><p>Conoce nuestro proceso para hacer discípulos siguiendo el modelo de Jesús.</p></div>
          <div className="card"><span>03</span><h3>Conviértete en constructor</h3><p>Si quieres realizar un aporte significativo, queremos conocer tu historia y compartirte la visión.</p></div>
        </div>
      </section>

      <section className="gallery">
        <div><Image src="/images/reunion-2.jpeg" alt="Comunidad" fill sizes="33vw" /></div>
        <div><Image src="/images/reunion-1.jpeg" alt="Discipulado" fill sizes="33vw" /></div>
        <div><Image src="/images/reunion-3.jpeg" alt="Familias" fill sizes="33vw" /></div>
      </section>

      <section className="final">
        <div className="eyebrow">LOMAS DE GRANADA · 2026</div>
        <h2>La visión es grande.<br /><em>Pero juntos podemos construirla.</em></h2>
        <p>Primero, la tierra. Después, la Casa. Siempre, los discípulos.</p>
        <a href="#aportar" className="primaryButton">Quiero construir la Casa →</a>
      </section>

      <footer>
        <div className="footerBrand"><Image src="/images/logo-la-alianza.png" alt="La Alianza" width={45} height={45} /><span>La Alianza · Caminando con Jesús</span></div>
        <span>Casa de Discípulos · Lomas de Granada · Popayán</span>
      </footer>

      <style jsx global>{`
        *{box-sizing:border-box} html{scroll-behavior:smooth}
        body{margin:0;background:#f6f2ec;color:#171717;font-family:Arial,sans-serif}
        a{text-decoration:none;color:inherit} button,input,select{font:inherit}
        .nav{height:80px;padding:0 6vw;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;background:rgba(246,242,236,.95);backdrop-filter:blur(12px);border-bottom:1px solid #e5dfd7}
        .brand{display:flex;align-items:center;gap:12px}.brand img{object-fit:contain}.brand strong{display:block;font-size:11px;letter-spacing:.15em}.brand span{display:block;color:#b50913;font-family:Georgia,serif;font-style:italic;font-size:17px}
        .navButton,.primaryButton{background:#b50913;color:white;padding:14px 22px;border-radius:999px;font-weight:700;display:inline-block}
        .hero{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 80px)}.heroText{padding:8vw;display:flex;flex-direction:column;justify-content:center}
        .eyebrow{color:#b50913;font-size:11px;letter-spacing:.2em;font-weight:700;margin-bottom:20px}
        h1{font-size:clamp(42px,5vw,72px);line-height:1.02;letter-spacing:-.045em;margin:0 0 25px}h1 em,h2 em{color:#b50913;font-family:Georgia,serif;font-style:italic}
        .lead{color:#66615d;font-size:18px;line-height:1.7;max-width:650px}
        .progressCard{background:white;padding:22px;border-radius:18px;border:1px solid #e5dfd7;max-width:650px;margin-top:10px}
        .progressHeader,.moneyRow{display:flex;justify-content:space-between;gap:20px}.progressHeader strong{color:#b50913}
        .progressBar{height:12px;background:#ece7df;border-radius:99px;overflow:hidden;margin:16px 0}.progressBar div{height:100%;background:#b50913;transition:width .8s ease}
        .moneyRow small{display:block;color:#888;margin-bottom:4px}.moneyRow b{font-size:21px}.smallText{color:#999;font-size:12px}
        .heroActions{display:flex;align-items:center;gap:15px;margin-top:20px}.secondaryButton{font-weight:700;padding:14px}
        .heroImage,.storyImage{position:relative;min-height:550px}.heroImage img,.storyImage img,.gallery img{object-fit:cover}
        .imageBadge{position:absolute;z-index:2;bottom:30px;left:30px;background:white;padding:14px 18px;border-radius:8px}.imageBadge strong{color:#b50913;margin-right:5px}
        .section{padding:110px 8vw}.white{background:white}.sectionIntro{max-width:800px}.center{margin:auto;text-align:center}
        h2{font-size:clamp(38px,5vw,64px);line-height:1.05;letter-spacing:-.04em;margin:0 0 20px}.sectionIntro p{color:#66615d;font-size:18px;line-height:1.7}
        .visionGrid,.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:55px}
        .visionCard,.card{padding:30px;border:1px solid #e5dfd7;border-radius:18px;background:#f6f2ec}.visionCard span,.card span{color:#b50913;font-weight:700}
        .visionCard h3,.card h3{font-size:24px;margin:40px 0 10px}.visionCard p,.card p{color:#66615d;line-height:1.65}
        .story{display:grid;grid-template-columns:1fr 1fr}.storyText{padding:8vw;background:#181716;color:white;display:flex;flex-direction:column;justify-content:center}
        .storyText p{color:#c9c4bf;font-size:18px;line-height:1.7}.storyText .eyebrow{color:#e32a35}.quote{border-left:3px solid #b50913;padding-left:20px;font-family:Georgia,serif;font-size:25px!important}
        .contribution{background:#f6f2ec}.contributionBox{max-width:700px;margin:45px auto 0;background:white;padding:35px;border-radius:22px;box-shadow:0 20px 50px rgba(0,0,0,.08)}
        .amountOptions{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:25px}.amount{border:1px solid #ddd5cb;background:white;border-radius:10px;padding:12px 5px;cursor:pointer;font-weight:700}.amount.active{background:#b50913;color:white;border-color:#b50913}
        .contributionBox label{display:block;font-weight:700;font-size:14px;margin:18px 0 8px}.amountInput,.contributionBox select{width:100%;border:1px solid #ddd5cb;border-radius:10px;background:white;height:55px}
        .amountInput{display:flex;align-items:center;padding:0 15px;gap:10px}.amountInput span{color:#777;font-weight:700}.amountInput input{border:0;outline:0;width:100%;font-size:18px}.contributionBox select{padding:0 15px}
        .whatsappButton{width:100%;border:0;margin-top:22px;padding:17px;border-radius:999px;background:#1f9d55;color:white;font-weight:700;cursor:pointer;font-size:16px}
        .securityText{text-align:center;color:#999;font-size:12px;line-height:1.5}.gallery{display:grid;grid-template-columns:repeat(3,1fr);height:430px}.gallery>div{position:relative}
        .final{background:#181716;color:white;text-align:center;padding:120px 20px}.final h2{margin-bottom:20px}.final p{color:#c8c3bd;font-size:18px;margin-bottom:30px}.final .eyebrow{color:#e32a35}
        footer{padding:30px 7vw;background:#111;color:#999;display:flex;justify-content:space-between;gap:20px;font-size:12px}.footerBrand{display:flex;align-items:center;gap:10px;color:white}
        @media(max-width:900px){.hero,.story{grid-template-columns:1fr}.heroImage{order:-1;min-height:400px}.heroText,.section{padding:70px 22px}.visionGrid,.cards{grid-template-columns:1fr}.amountOptions{grid-template-columns:repeat(2,1fr)}.gallery{grid-template-columns:1fr;height:auto}.gallery>div{height:300px}footer{flex-direction:column}}
        @media(max-width:500px){.nav{padding:0 18px}.navButton{display:none}.brand strong{font-size:9px}.brand span{font-size:14px}h1{font-size:42px}.heroActions{flex-direction:column;align-items:stretch}.primaryButton,.secondaryButton{text-align:center}.moneyRow{flex-direction:column}.contributionBox{padding:22px}}
      `}</style>
    </main>
  );
}
