// src/App.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const STORAGE_KEY = "app2-ganduri-emotii-v1";

// Scenarii educative – mix: trafic, job, cuplu, despărțire, viață de zi cu zi
const SCENARIOS = [
  {
    id: 1,
    title: "Mihai și mașina care nu pornește",
    situation:
      "Dimineața, Mihai se grăbește să ajungă la serviciu. Mașina nu mai pornește și își dă seama că va întârzia.",
    irrationalEmotion: "Furie intensă (irațională)",
    rationalEmotion: "Frustrare / supărare moderată (rațională)",
    question:
      "De ce crezi că Mihai simte furie atât de intensă, nu doar frustrare?",
    options: [
      {
        id: "A",
        variant: "rational",
        text: "Pentru că mașina nu pornește și va întârzia la muncă.",
      },
      {
        id: "B",
        variant: "irrational",
        text: "Pentru că își spune: „Numai mie mi se întâmplă, nu mai suport viața asta, este groaznic!”.",
      },
    ],
  },
  {
    id: 2,
    title: "Andreea și mesajul care întârzie",
    situation:
      "Andreea îi scrie partenerului un mesaj important. Trec câteva ore și el nu răspunde.",
    irrationalEmotion: "Anxietate intensă, aproape panică (irațională)",
    rationalEmotion: "Îngrijorare / neliniște moderată (rațională)",
    question:
      "Ce gând face ca anxietatea Andreei să devină extremă, nu doar îngrijorare normală?",
    options: [
      {
        id: "A",
        variant: "irrational",
        text: "„Dacă nu răspunde, înseamnă că nu mai contez, sigur mă va părăsi, nu pot suporta asta.”",
      },
      {
        id: "B",
        variant: "rational",
        text: "„Poate e ocupat sau supărat. Nu îmi place, dar vom putea vorbi și clarifica.”",
      },
    ],
  },
  {
    id: 3,
    title: "Cearta în cuplu",
    situation:
      "Într-o seară, un cuplu obosit după serviciu ajunge să ridice tonul într-o discuție despre bani.",
    irrationalEmotion: "Disperare / tristețe extremă (irațională)",
    rationalEmotion: "Nemulțumire, tristețe moderată (rațională)",
    question:
      "Unul dintre parteneri cade într-o tristețe foarte puternică. Ce gând întreține această emoție irațională?",
    options: [
      {
        id: "A",
        variant: "irrational",
        text: "„Dacă ne certăm, înseamnă că nu mă iubește cu adevărat, relația noastră este un eșec total.”",
      },
      {
        id: "B",
        variant: "rational",
        text: "„Ne certăm urât și asta mă doare, dar suntem obosiți. Putem discuta mai calm mai târziu.”",
      },
    ],
  },
  {
    id: 4,
    title: "Despărțirea trăită diferit",
    situation:
      "După luni de tensiuni, o relație se încheie. Ambii parteneri sunt afectați, dar reacționează diferit.",
    irrationalEmotion:
      "Disperare profundă, sentiment că viața s-a terminat (irațională)",
    rationalEmotion: "Tristețe, regret, dezamăgire (emoții raționale)",
    question:
      "Unul dintre parteneri cade într-o depresie puternică, celălalt este trist, dar funcționează. Ce gând susține depresia?",
    options: [
      {
        id: "A",
        variant: "rational",
        text: "„Îmi pare foarte rău că s-a terminat. Am pierdut ceva important pentru mine.”",
      },
      {
        id: "B",
        variant: "irrational",
        text: "„Fără el/ea, viața mea nu mai are niciun sens, nu voi mai fi fericit niciodată.”",
      },
    ],
  },
  {
    id: 5,
    title: "Traficul și furia",
    situation:
      "În trafic, cineva îi taie brusc calea unui șofer. Nu se întâmplă nicio accidentare, dar șoferul se înfurie foarte tare.",
    irrationalEmotion: "Furie extremă / „criză de nervi” (irațională)",
    rationalEmotion: "Iritare, enervare moderată (rațională)",
    question:
      "Care gând transformă iritarea normală într-o furie exagerată, care îi strică întreaga zi?",
    options: [
      {
        id: "A",
        variant: "irrational",
        text: "„Este inadmisibil să îndrăznească cineva să facă asta cu mine, nu suport idioții ăștia, ar trebui pedepsiți imediat!”",
      },
      {
        id: "B",
        variant: "rational",
        text: "„A condus aiurea, nu îmi place comportamentul lui, dar nu merită să-mi distrug întreaga zi.”",
      },
    ],
  },
  {
    id: 6,
    title: "Critica la serviciu",
    situation:
      "La birou, șeful îi atrage atenția unui angajat că a greșit într-un raport.",
    irrationalEmotion: "Rușine intensă + auto-devalorizare (irațională)",
    rationalEmotion: "Regret, frustrare, poate ușoară rușine (raționale)",
    question:
      "Ce gând duce la rușine extremă și auto-etichetare, în loc de regret normal pentru o greșeală?",
    options: [
      {
        id: "A",
        variant: "rational",
        text: "„Am greșit, nu îmi place deloc, dar pot învăța și corecta data viitoare.”",
      },
      {
        id: "B",
        variant: "irrational",
        text: "„Dacă am greșit, înseamnă că sunt incapabil, un ratat, nu valorez mare lucru.”",
      },
    ],
  },
];

const PIE_COLORS = ["#22d3ee", "#f97373"]; // corecte / greșite

function App() {
  // Răspunsurile utilizatorului: [{scenarioId, optionId, isCorrect}]
  const [answers, setAnswers] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Nu pot citi din localStorage", err);
      return [];
    }
  });

  // Indexul scenariului curent
  const [currentIndex, setCurrentIndex] = useState(0);
  // Opțiunea aleasă la scenariul curent
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [feedback, setFeedback] = useState(null); // {isCorrect, message}

  // Salvăm în localStorage de fiecare dată când se schimbă answers
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (err) {
      console.error("Nu pot salva în localStorage", err);
    }
  }, [answers]);

  const currentScenario = SCENARIOS[currentIndex];

  // Căutăm dacă scenariul curent are deja un răspuns din istoric
  const existingAnswer = useMemo(
    () => answers.find((a) => a.scenarioId === currentScenario.id),
    [answers, currentScenario.id]
  );

  // La schimbarea scenariului, resetăm starea locală (sau o încărcăm din istoric)
  useEffect(() => {
    if (existingAnswer) {
      setSelectedOptionId(existingAnswer.optionId);
      setFeedback({
        isCorrect: existingAnswer.isCorrect,
        message: buildFeedbackMessage(currentScenario, existingAnswer),
      });
    } else {
      setSelectedOptionId(null);
      setFeedback(null);
    }
  }, [currentScenario, existingAnswer]);

  // Statistici pentru Recharts
  const stats = useMemo(() => {
    const total = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const wrong = total - correct;
    return [
      { name: "Răspunsuri corecte", value: correct },
      { name: "Răspunsuri greșite", value: wrong },
    ];
  }, [answers]);

  const handleSelectOption = (optionId) => {
    if (selectedOptionId) return; // nu permitem schimbarea răspunsului

    const option = currentScenario.options.find((o) => o.id === optionId);
    const isCorrect = option.variant === "irrational";

    const newAnswer = {
      scenarioId: currentScenario.id,
      optionId,
      isCorrect,
    };

    setAnswers((prev) => {
      const others = prev.filter((a) => a.scenarioId !== currentScenario.id);
      return [...others, newAnswer];
    });

    setSelectedOptionId(optionId);
    setFeedback({
      isCorrect,
      message: buildFeedbackMessage(currentScenario, newAnswer),
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SCENARIOS.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SCENARIOS.length - 1 : prev - 1));
  };

  const handleResetProgress = () => {
    if (
      window.confirm("Ești sigur că vrei să ștergi toate răspunsurile tale?")
    ) {
      setAnswers([]);
      setSelectedOptionId(null);
      setFeedback(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* glow background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 md:py-10">
        <Header answers={answers} />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ScenarioCard
            scenario={currentScenario}
            currentIndex={currentIndex}
            total={SCENARIOS.length}
            selectedOptionId={selectedOptionId}
            feedback={feedback}
            onSelectOption={handleSelectOption}
            onNext={goToNext}
            onPrev={goToPrev}
          />
          <StatsPanel
            stats={stats}
            answers={answers}
            onReset={handleResetProgress}
          />
        </div>

        <PsychoEducationSection />
      </main>
    </div>
  );
}

// ---------- COMPONENTE ----------

function Header({ answers }) {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;

  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          CBT · RETB · Gânduri → Emoții · Cuplu & viață de zi cu zi
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Gândurile care aprind emoțiile
          <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400 bg-clip-text text-lg text-transparent md:text-xl">
            De ce două persoane pot simți atât de diferit în aceeași situație?
          </span>
        </h1>
        <p className="max-w-3xl text-sm text-slate-300 md:text-base">
          În fiecare scenariu ai aceeași situație, dar două variante de gând.
          Una duce la o emoție normală, rațională (frustrare, regret,
          îngrijorare moderată). Cealaltă duce la emoții exagerate și
          copleșitoare (furie extremă, disperare, panică). Tu alegi care gând
          explică emoția intensă.
        </p>
      </motion.div>

      <motion.div
        className="mt-2 flex items-center gap-3 text-[11px] text-slate-300 md:mt-0"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2">
          <div>Scenarii parcurse: {total}</div>
          <div className="text-cyan-300">Răspunsuri corecte: {correct}</div>
        </div>
      </motion.div>
    </header>
  );
}

function ScenarioCard({
  scenario,
  currentIndex,
  total,
  selectedOptionId,
  feedback,
  onSelectOption,
  onNext,
  onPrev,
}) {
  return (
    <motion.section
      className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-xl shadow-slate-950/80"
      key={scenario.id}
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Scenariul {currentIndex + 1} / {total}
        </span>
        <div className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Situații din viața reală, inclusiv cuplu și despărțire
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-slate-50 md:text-base">
          {scenario.title}
        </h2>
        <p className="text-sm text-slate-300">{scenario.situation}</p>
      </div>

      <div className="grid gap-3 text-xs text-slate-200 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-rose-300">
            Emoție irațională (exagerată)
          </div>
          <div className="mt-1 text-[13px]">{scenario.irrationalEmotion}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            De obicei apare când gândul este absolutist, catastrofic sau extrem
            („nu suport”, „este groaznic”, „viața nu mai are sens”).
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
            Emoție rațională (normală)
          </div>
          <div className="mt-1 text-[13px]">{scenario.rationalEmotion}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            Emoțiile raționale sunt tot neplăcute, dar nu te distrug: te ajută
            să te adaptezi (regret, frustrare, îngrijorare moderată).
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-100">
          {scenario.question}
        </p>
        <p className="text-[11px] text-slate-400">
          Alege gândul care explică emoția exagerată (irațională). Celălalt gând
          duce la o emoție normală, de intensitate moderată.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {scenario.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrect = selectedOptionId && opt.variant === "irrational";
          const isWrong =
            selectedOptionId &&
            opt.id === selectedOptionId &&
            opt.variant === "rational";

          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onSelectOption(opt.id)}
              whileHover={{ y: selectedOptionId ? 0 : -3 }}
              className={`flex h-full flex-col rounded-2xl border px-3 py-3 text-left text-xs transition ${
                isCorrect
                  ? "border-emerald-400 bg-emerald-500/10 text-emerald-100"
                  : isWrong
                  ? "border-rose-500 bg-rose-500/10 text-rose-100"
                  : "border-slate-800 bg-slate-950/90 text-slate-100 hover:border-cyan-400/70 hover:bg-slate-900/80"
              }`}
              disabled={!!selectedOptionId}
            >
              <div className="mb-1 flex items-center justify-between text-[11px]">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/80 text-[11px] font-semibold">
                  {opt.id}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    opt.variant === "irrational"
                      ? "bg-rose-500/10 text-rose-300 border border-rose-500/40"
                      : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {opt.variant === "irrational"
                    ? "gând irațional"
                    : "gând rațional"}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed">{opt.text}</p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={`rounded-2xl border px-3 py-3 text-[11px] ${
              feedback.isCorrect
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-100"
                : "border-rose-500 bg-rose-500/10 text-rose-100"
            }`}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2 text-[11px] text-slate-300">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrev}
            className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 hover:border-cyan-400/70 hover:text-cyan-200"
          >
            ◀ Scenariul anterior
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 hover:border-cyan-400/70 hover:text-cyan-200"
          >
            Scenariul următor ▶
          </button>
        </div>
      </div>
    </motion.section>
  );
}

function StatsPanel({ stats, answers, onReset }) {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = total - correct;

  return (
    <motion.aside
      className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-4 shadow-xl shadow-slate-950/80"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-100">Progresul tău</h2>
        <p className="text-[11px] text-slate-400">
          Vezi câte emoții iraționale ai reușit să identifici corect. Pe măsură
          ce recunoști gândurile extreme, devine mai ușor să le schimbi.
        </p>
      </div>

      <div className="h-56 rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
        {total === 0 ? (
          <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
            Răspunde la cel puțin un scenariu pentru a vedea graficul.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats}
                dataKey="value"
                nameKey="name"
                innerRadius={35}
                outerRadius={70}
                paddingAngle={3}
              >
                {stats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#020617",
                  border: "1px solid #334155",
                  fontSize: 12,
                  color: "#e5e7eb",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconSize={10}
                formatter={(value) => (
                  <span style={{ fontSize: 11, color: "#cbd5f5" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="space-y-1 text-[11px] text-slate-300">
        <div>Total scenarii răspunse: {total}</div>
        <div className="text-emerald-300">
          Răspunsuri corecte (ai identificat gândul irațional): {correct}
        </div>
        <div className="text-rose-300">
          Răspunsuri greșite (ai ales gândul rațional): {wrong}
        </div>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2 text-[11px] font-semibold text-slate-200 hover:border-rose-500 hover:text-rose-300"
      >
        Resetează toate răspunsurile
      </button>
    </motion.aside>
  );
}

function PsychoEducationSection() {
  return (
    <section className="mb-6 space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-5 text-xs text-slate-300 shadow-xl shadow-slate-950/80">
      <h2 className="text-sm font-semibold text-slate-100">
        Emoții raționale vs emoții iraționale (modelul RETB)
      </h2>
      <p>
        În psihoterapia rațional-emotivă (RETB), distingem între emoțiile
        <span className="text-emerald-300"> raționale</span> și cele
        <span className="text-rose-300"> iraționale</span>. Ambele pot fi
        neplăcute, dar se deosebesc prin intensitate și prin felul în care te
        ajută (sau îți blochează) adaptarea.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
          <h3 className="mb-1 text-[12px] font-semibold text-emerald-300">
            Exemple de emoții raționale (normale)
          </h3>
          <ul className="space-y-1 list-disc pl-4">
            <li>Regret după o greșeală („Aș fi preferat să nu fac asta.”)</li>
            <li>Frustrare / nemulțumire într-o ceartă de cuplu.</li>
            <li>Îngrijorare moderată pentru viitor („Sper să iasă bine.”)</li>
            <li>Tristețe normală după o despărțire sau pierdere.</li>
          </ul>
          <p className="mt-2 text-[11px] text-slate-400">
            Gânduri tipice: „Nu îmi place ce s-a întâmplat, dar pot suporta și
            pot face ceva în privința asta.”
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
          <h3 className="mb-1 text-[12px] font-semibold text-rose-300">
            Exemple de emoții iraționale (exagerate)
          </h3>
          <ul className="space-y-1 list-disc pl-4">
            <li>Furie extremă în trafic sau într-o discuție obișnuită.</li>
            <li>
              Disperare totală după o despărțire („Viața mea s-a terminat.”)
            </li>
            <li>Rușine intensă („Sunt un ratat, nu valorez nimic.”)</li>
            <li>Panica extremă în situații de viață normale.</li>
          </ul>
          <p className="mt-2 text-[11px] text-slate-400">
            Gânduri tipice: „Este groaznic, nu ar trebui să fie așa, nu pot
            suporta, viața nu mai are sens dacă se întâmplă asta.”
          </p>
        </div>
      </div>
      <p>
        În această aplicație,{" "}
        <span className="text-rose-300">răspunsul corect</span> este gândul
        irațional care explică emoția extremă. Celălalt gând, mai echilibrat, ar
        duce la o emoție
        <span className="text-emerald-300"> rațională</span>, de intensitate
        normală. În aplicația următoare vom învăța cum să înlocuim pas cu pas
        gândurile iraționale cu variante mai sănătoase.
      </p>
    </section>
  );
}

// ---------- logica explicatiei ----------

function buildFeedbackMessage(scenario, answer) {
  const chosen = scenario.options.find((o) => o.id === answer.optionId);
  const irrationalOpt = scenario.options.find(
    (o) => o.variant === "irrational"
  );
  const rationalOpt = scenario.options.find((o) => o.variant === "rational");

  if (answer.isCorrect) {
    return (
      <>
        <span className="font-semibold">
          Corect. Emoția irațională ({scenario.irrationalEmotion.toLowerCase()})
          este întreținută de gândul: „{irrationalOpt.text}”
        </span>
        <br />
        <br />
        Observă cum acest gând este absolutist și catastrofic. Dacă persoana ar
        gândi mai degrabă: „{rationalOpt.text}”, emoția ar deveni una rațională,
        de tip <span className="underline">{scenario.rationalEmotion}</span>, nu
        ar mai ajunge la {scenario.irrationalEmotion}.
      </>
    );
  } else {
    return (
      <>
        <span className="font-semibold">
          Aproape. Gândul ales de tine este mai degrabă rațional:
        </span>{" "}
        „{chosen.text}”. El ar duce la o emoție
        <span className="text-emerald-200">
          {" "}
          {scenario.rationalEmotion.toLowerCase()}
        </span>
        , adică neplăcută, dar suportabilă.
        <br />
        <br />
        Emoția irațională, foarte intensă (
        {scenario.irrationalEmotion.toLowerCase()}) este susținută mai degrabă
        de gândul: „{irrationalOpt.text}”. Acela este gândul exagerat,
        absolutist, care „aprinde focul”. În aplicațiile următoare vom exersa
        cum să îl înlocuim cu variante mai echilibrate.
      </>
    );
  }
}

export default App;
