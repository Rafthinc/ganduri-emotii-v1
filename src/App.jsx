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

const STORAGE_KEY = "app2-ganduri-emotii-sanatoase-v1";

const SCENARIOS = [
  {
    id: 1,
    title: "Mihai și mașina care nu pornește",
    situation:
      "Dimineața, Mihai se grăbește să ajungă la serviciu. Mașina nu mai pornește și își dă seama că va întârzia.",
    unhealthyEmotion:
      "Furie intensă, explozivă (emoție nesănătoasă, dezadaptativă)",
    healthyEmotion:
      "Frustrare / supărare moderată (emoție sănătoasă, adaptativă)",
    question:
      "De ce crezi că Mihai ajunge să simtă furie intensă, nu doar frustrare normală?",
    options: [
      {
        id: "A",
        variant: "rational", // gând rațional → emoție sănătoasă
        text: "„Nu îmi place deloc că întârzii, dar se mai întâmplă. O să găsesc o soluție acum și data viitoare voi verifica mașina din timp.”",
      },
      {
        id: "B",
        variant: "irrational", // gând irațional → emoție nesănătoasă
        text: "„Este îngrozitor, numai mie mi se întâmplă, nu suport viața asta, totul merge prost!”",
      },
    ],
  },
  {
    id: 2,
    title: "Andreea și mesajul care întârzie",
    situation:
      "Andreea îi scrie partenerului un mesaj important. Trec câteva ore și el nu răspunde.",
    unhealthyEmotion: "Anxietate intensă, aproape panică (emoție nesănătoasă)",
    healthyEmotion: "Îngrijorare / neliniște moderată (emoție sănătoasă)",
    question:
      "Ce gând transformă o îngrijorare normală într-o anxietate copleșitoare pentru Andreea?",
    options: [
      {
        id: "A",
        variant: "irrational",
        text: "„Dacă nu răspunde, înseamnă că nu mai contez, sigur mă va părăsi, nu pot suporta asta.”",
      },
      {
        id: "B",
        variant: "rational",
        text: "„Nu îmi place deloc că nu răspunde. Poate e ocupat sau supărat. Când vom vorbi, o să-i spun cum mă simt.”",
      },
    ],
  },
  {
    id: 3,
    title: "Cearta în cuplu",
    situation:
      "Într-o seară, un cuplu obosit după serviciu ajunge să ridice tonul într-o discuție despre bani.",
    unhealthyEmotion: "Disperare / tristețe copleșitoare (emoție nesănătoasă)",
    healthyEmotion: "Nemulțumire, tristețe moderată (emoție sănătoasă)",
    question:
      "Unul dintre parteneri cade într-o tristețe foarte puternică după ceartă. Ce gând întreține această emoție nesănătoasă?",
    options: [
      {
        id: "A",
        variant: "irrational",
        text: "„Dacă ne certăm, înseamnă că nu mă iubește cu adevărat, relația noastră este un eșec total, nu mai are rost nimic.”",
      },
      {
        id: "B",
        variant: "rational",
        text: "„Mă doare foarte tare că ne-am certat, dar suntem obosiți și tensionați. Putem reveni asupra discuției mai târziu, mai liniștiți.”",
      },
    ],
  },
  {
    id: 4,
    title: "Despărțirea trăită diferit",
    situation:
      "După luni de tensiuni, o relație se încheie. Ambii parteneri sunt afectați, dar reacționează diferit.",
    unhealthyEmotion:
      "Disperare profundă, sentiment că viața s-a terminat (emoție nesănătoasă)",
    healthyEmotion: "Tristețe, regret, dezamăgire (emoții sănătoase)",
    question:
      "Unul dintre parteneri cade într-o depresie puternică, celălalt este trist, dar funcționează. Ce gând susține emoția nesănătoasă, copleșitoare?",
    options: [
      {
        id: "A",
        variant: "rational",
        text: "„Îmi pare foarte rău că s-a terminat. Am pierdut ceva important pentru mine și am nevoie de timp să mă vindec.”",
      },
      {
        id: "B",
        variant: "irrational",
        text: "„Fără el/ea, viața mea nu mai are sens, nu voi mai fi fericit niciodată, totul este distrus definitiv.”",
      },
    ],
  },
  {
    id: 5,
    title: "Traficul și furia",
    situation:
      "În trafic, cineva îi taie brusc calea unui șofer. Nu se întâmplă niciun accident, dar șoferul se înfurie foarte tare.",
    unhealthyEmotion:
      "Furie extremă / „criză de nervi” (emoție nesănătoasă, disproporționată)",
    healthyEmotion: "Iritare, enervare moderată (emoție sănătoasă)",
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
        text: "„A condus foarte urât, nu îmi place deloc, dar nu merită să-mi stric toată ziua pentru asta.”",
      },
    ],
  },
  {
    id: 6,
    title: "Critica la serviciu",
    situation:
      "La birou, șeful îi atrage atenția unui angajat că a greșit într-un raport.",
    unhealthyEmotion:
      "Rușine intensă + auto-devalorizare (emoție nesănătoasă, blocantă)",
    healthyEmotion:
      "Regret, supărare, poate ușoară rușine (emoții sănătoase, motivate de învățare)",
    question:
      "Ce gând duce la rușine extremă și auto-etichetare, în loc de regret normal pentru o greșeală?",
    options: [
      {
        id: "A",
        variant: "rational",
        text: "„Am greșit și nu îmi place deloc, dar pot învăța și pot fi mai atent data viitoare.”",
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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const currentScenario = SCENARIOS[currentIndex];

  const existingAnswer = useMemo(
    () => answers.find((a) => a.scenarioId === currentScenario.id),
    [answers, currentScenario.id]
  );

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (err) {
      console.error("Nu pot salva în localStorage", err);
    }
  }, [answers]);

  const stats = useMemo(() => {
    const total = answers.length;
    const correct = answers.filter((a) => a.isCorrect).length;
    const wrong = total - correct;
    return [
      { name: "Ai identificat gândul irațional", value: correct },
      { name: "Ai ales gândul rațional", value: wrong },
    ];
  }, [answers]);

  const handleSelectOption = (optionId) => {
    if (selectedOptionId) return;

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
          CBT · REBT · Gânduri → Emoții · Cuplu & viață de zi cu zi
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          Gândurile care determină intensitatea emoțiilor
          <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-indigo-400 bg-clip-text text-lg text-transparent md:text-xl">
            De ce două persoane pot simți atât de diferit în aceeași situație?
          </span>
        </h1>
        <p className="max-w-3xl text-sm text-slate-300 md:text-base">
          În fiecare scenariu ai aceeași situație externă, dar două variante de
          gând. Un gând este mai echilibrat și duce la o emoție sănătoasă,
          adaptativă (frustrare, regret, îngrijorare moderată). Celălalt gând
          este irațional, extrem, și duce la o emoție nesănătoasă, dezadaptativă
          (furie intensă, disperare, panică). Tu alegi care gând aprinde emoția
          nesănătoasă.
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
          <div className="text-cyan-300">
            Ai identificat gândul irațional în: {correct} scenarii
          </div>
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
            Emoție nesănătoasă (dezadaptativă)
          </div>
          <div className="mt-1 text-[13px]">{scenario.unhealthyEmotion}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            De obicei este foarte intensă, disproporționată față de situație, te
            blochează sau îți strică ziua. Apare când gândul este extrem,
            absolutist, de tip „nu suport”, „este îngrozitor”, „viața nu mai are
            sens”.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
            Emoție sănătoasă (adaptativă)
          </div>
          <div className="mt-1 text-[13px]">{scenario.healthyEmotion}</div>
          <p className="mt-1 text-[11px] text-slate-400">
            Este tot neplăcută, dar proporțională cu situația. Te ajută să te
            adaptezi, să înveți, să protejezi ce e important pentru tine fără să
            te distrugă emoțional.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-100">
          {scenario.question}
        </p>
        <p className="text-[11px] text-slate-400">
          Alege gândul care generează emoția nesănătoasă, exagerată. Celălalt
          gând, mai echilibrat, ar duce la o emoție sănătoasă, de intensitate
          moderată.
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
          Vezi de câte ori ai reușit să recunoști gândul irațional care aprinde
          emoția nesănătoasă. Pe măsură ce devii mai conștient, vei putea să îl
          schimbi mai ușor.
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
          Ai identificat gândul irațional (emoție nesănătoasă): {correct}
        </div>
        <div className="text-rose-300">
          Ai ales gândul rațional (emoție sănătoasă): {wrong}
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
        Emoții sănătoase vs emoții nesănătoase (în CBT și REBT)
      </h2>
      <p>
        În CBT și în psihoterapia rațional-emotivă (REBT), nu vorbim despre
        „emoții bune” sau „emoții rele”, ci despre{" "}
        <span className="text-emerald-300">emoții sănătoase (adaptative)</span>{" "}
        și{" "}
        <span className="text-rose-300">
          emoții nesănătoase (dezadaptative)
        </span>
        . Emoțiile sunt influențate de felul în care interpretăm situațiile,
        adică de gândurile noastre.
        <span className="text-rose-300">
          {" "}
          Cu cât gândurile sunt mai iraționale, extreme și absolutiste,
        </span>
        <span className="text-rose-500">
          {" "}
          cu atât emoțiile devin mai nesănătoase, copleșitoare și dezadaptative.
        </span>
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
          <h3 className="mb-1 text-[12px] font-semibold text-emerald-300">
            Emoții sănătoase (adaptative)
          </h3>
          <ul className="space-y-1 list-disc pl-4">
            <li>Regret după o greșeală („Aș fi preferat să nu fac asta.”)</li>
            <li>Frustrare / nemulțumire într-o ceartă de cuplu.</li>
            <li>Îngrijorare moderată pentru viitor („Sper să iasă bine.”)</li>
            <li>Tristețe normală după o despărțire sau pierdere.</li>
          </ul>
          <p className="mt-2 text-[11px] text-slate-400">
            Gânduri asociate: „Nu îmi place ce s-a întâmplat, dar pot suporta,
            pot învăța și pot face ceva în privința asta.”
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3">
          <h3 className="mb-1 text-[12px] font-semibold text-rose-300">
            Emoții nesănătoase (dezadaptative)
          </h3>
          <ul className="space-y-1 list-disc pl-4">
            <li>Furie extremă în trafic sau într-o discuție obișnuită.</li>
            <li>
              Disperare totală după o despărțire („Viața mea s-a terminat.”)
            </li>
            <li>Rușine intensă („Sunt un nimic, un ratat.”)</li>
            <li>Panica extremă în situații de viață normale.</li>
          </ul>
          <p className="mt-2 text-[11px] text-slate-400">
            Gânduri asociate: „Este groaznic, nu ar trebui să fie așa, nu pot
            suporta, viața nu mai are sens dacă se întâmplă asta.”
          </p>
        </div>
      </div>
      <p>
        În această aplicație,{" "}
        <span className="text-rose-300">răspunsul corect</span> este gândul
        irațional care explică apariția unei emoții nesănătoase, dezadaptative.
        Celălalt gând este mai rațional și ar duce la o emoție{" "}
        <span className="text-emerald-300">
          sănătoasă, proporțională cu situația
        </span>
        . În aplicația următoare veți exersa cum să reformulați pas cu pas
        gândurile iraționale.
      </p>
    </section>
  );
}

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
          Corect. Gândul pe care l-ai ales este irațional și aprinde emoția
          nesănătoasă: {scenario.unhealthyEmotion.toLowerCase()}.
        </span>
        <br />
        <br />
        Observă cum gândul: „{irrationalOpt.text}” este extrem, absolutist,
        catastrofic. Dacă persoana ar gândi mai degrabă:
        <br />
        <span className="italic">„{rationalOpt.text}”</span>, emoția ar deveni
        una sănătoasă, de tip{" "}
        <span className="underline">{scenario.healthyEmotion}</span>, nu ar mai
        ajunge la {scenario.unhealthyEmotion}.
      </>
    );
  } else {
    return (
      <>
        <span className="font-semibold">
          Aproape. Gândul ales de tine este mai degrabă rațional și ar duce la o
          emoție sănătoasă, adaptativă.
        </span>
        <br />
        <br />
        Gândul: „{chosen.text}” exprimă nemulțumire sau tristețe, dar nu este
        catastrofic. O persoană care gândește astfel ar simți mai degrabă{" "}
        <span className="text-emerald-200">
          {scenario.healthyEmotion.toLowerCase()}
        </span>
        .
        <br />
        <br />
        Emoția nesănătoasă, copleșitoare (
        {scenario.unhealthyEmotion.toLowerCase()}) este susținută mai degrabă de
        gândul:
        <br />
        <span className="italic">„{irrationalOpt.text}”</span>. Acesta este
        gândul exagerat, absolutist, care „aprinde focul”. În aplicațiile
        următoare vei exersa cum să îl reformulezi în variante mai echilibrate.
      </>
    );
  }
}

export default App;
