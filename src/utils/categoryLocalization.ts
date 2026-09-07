import { LanguageCode, BudgetPreset, Category, CapitalSourceType } from '../types';

interface LocalizedCategoryInfo {
  name: Record<LanguageCode, string>;
  description?: Record<LanguageCode, string>;
}

const CATEGORY_LOCALIZATIONS: Record<string, LocalizedCategoryInfo> = {
  'cat-pers-food': {
    name: {
      es: 'Alimentación & Supermercado',
      en: 'Food & Groceries',
      fr: 'Alimentation & Courses',
      de: 'Lebensmittel & Supermarkt',
      pt: 'Alimentação & Mercado',
      it: 'Cibo & Spesa',
      ja: '食費・スーパー',
      zh: '餐饮与生鲜',
      id: 'Makanan & Belanja',
    },
    description: {
      es: 'Comida, despensa, restaurantes y víveres',
      en: 'Groceries, dining out, and daily food',
      fr: 'Courses, restaurants et repas quotidiens',
      de: 'Einkäufe, Restaurants und Essen',
      pt: 'Supermercado, restaurantes e alimentação',
      it: 'Spesa, ristoranti e cibo quotidiano',
      ja: 'スーパーでの買い物、外食、日々の食費',
      zh: '日常生鲜、外卖与餐饮支出',
      id: 'Belanja dapur, makan di luar dan makanan sehari-hari',
    },
  },
  'cat-pers-housing': {
    name: {
      es: 'Vivienda & Renta',
      en: 'Housing & Rent',
      fr: 'Logement & Loyer',
      de: 'Wohnen & Miete',
      pt: 'Moradia & Aluguel',
      it: 'Casa & Affitto',
      ja: '住居費・家賃',
      zh: '住房与房租',
      id: 'Tempat Tinggal & Sewa',
    },
    description: {
      es: 'Alquiler, hipoteca, mantenimiento y hogar',
      en: 'Rent, mortgage, maintenance, and home',
      fr: 'Loyer, prêt, entretien et foyer',
      de: 'Miete, Hypothek, Instandhaltung und Heim',
      pt: 'Aluguel, hipoteca, condomínio e manutenção',
      it: 'Affitto, mutuo, manutenzione e casa',
      ja: '家賃、住宅ローン、維持費、生活空間',
      zh: '房租、房贷、物业维修与家居',
      id: 'Sewa rumah, cicilan, pemeliharaan dan tempat tinggal',
    },
  },
  'cat-pers-utilities': {
    name: {
      es: 'Servicios & Facturas',
      en: 'Utilities & Bills',
      fr: 'Factures & Services',
      de: 'Nebenkosten & Rechnungen',
      pt: 'Contas & Serviços',
      it: 'Utenze & Bollette',
      ja: '水道光熱費・請求書',
      zh: '水电与账单',
      id: 'Tagihan & Utilitas',
    },
    description: {
      es: 'Luz, agua, internet, gas y suscripciones',
      en: 'Electricity, water, web, gas, and subscriptions',
      fr: 'Électricité, eau, internet, gaz et abonnements',
      de: 'Strom, Wasser, Internet, Gas und Abos',
      pt: 'Luz, água, internet, gás e assinaturas',
      it: 'Luce, acqua, internet, gas e abbonamenti',
      ja: '電気、水道、ネット、ガス、定期契約',
      zh: '电费、水费、宽带网络与周期订阅',
      id: 'Listrik, air, internet, gas dan langganan',
    },
  },
  'cat-pers-transport': {
    name: {
      es: 'Transporte & Movilidad',
      en: 'Transport & Commute',
      fr: 'Transport & Déplacements',
      de: 'Transport & Mobilität',
      pt: 'Transporte & Mobilidade',
      it: 'Trasporti & Spostamenti',
      ja: '交通費・移動',
      zh: '交通与出行',
      id: 'Transportasi & Perjalanan',
    },
    description: {
      es: 'Gasolina, transporte público y mantenimiento',
      en: 'Fuel, transit passes, rides, and vehicle maintenance',
      fr: 'Essence, transports en commun et entretien',
      de: 'Treibstoff, Nahverkehr und Fahrzeugwartung',
      pt: 'Combustível, transporte público e manutenção',
      it: 'Benzina, mezzi pubblici e manutenzione auto',
      ja: 'ガソリン、公共交通機関、車両維持費',
      zh: '燃油充电、公共交通与车辆保养',
      id: 'Bensin, angkutan umum dan perawatan kendaraan',
    },
  },
  'cat-pers-leisure': {
    name: {
      es: 'Ocio & Gustos',
      en: 'Leisure & Entertainment',
      fr: 'Loisirs & Sorties',
      de: 'Freizeit & Vergnügen',
      pt: 'Lazer & Entretenimento',
      it: 'Tempo Libero & Svago',
      ja: '趣味・レジャー',
      zh: '休闲与娱乐',
      id: 'Hiburan & Rekreasi',
    },
    description: {
      es: 'Salidas, entretenimiento y gustos personales',
      en: 'Outings, movies, personal treats, and hobbies',
      fr: 'Sorties, divertissement, plaisirs et loisirs',
      de: 'Ausgehen, Filme, Hobbys und Vergnügen',
      pt: 'Passeios, entretenimento, hobbies e mimos',
      it: 'Uscite, cinema, svago personale e hobby',
      ja: '外遊び、映画、自己投資、趣味の時間',
      zh: '聚会观影、个人爱好与解压消费',
      id: 'Jalan-jalan, hiburan dan kesenangan pribadi',
    },
  },
  'cat-pers-savings': {
    name: {
      es: 'Ahorro & Metas',
      en: 'Savings & Goals',
      fr: 'Épargne & Objectifs',
      de: 'Sparen & Ziele',
      pt: 'Poupança & Metas',
      it: 'Risparmio & Obiettivi',
      ja: '貯金・目標',
      zh: '储蓄与目标',
      id: 'Tabungan & Target',
    },
    description: {
      es: 'Fondo de emergencia, metas y ahorro futuro',
      en: 'Emergency buffer, targets, and future wealth',
      fr: 'Fonds d\'urgence, projets et épargne future',
      de: 'Notgroschen, Sparziele und Zukunftsvorsorge',
      pt: 'Reserva de emergência, metas e futuro',
      it: 'Fondo emergenza, obiettivi e futuro',
      ja: '緊急予備資金、将来の夢、資産形成',
      zh: '应急备用金、阶段目标与未来资产',
      id: 'Dana darurat, target impian dan tabungan masa depan',
    },
  },
  'cat-biz-inventory': {
    name: {
      es: 'Proveedores & Mercancía',
      en: 'Suppliers & Inventory',
      fr: 'Fournisseurs & Marchandises',
      de: 'Lieferanten & Waren',
      pt: 'Fornecedores & Mercadorias',
      it: 'Fornitori & Merci',
      ja: '仕入れ・商品',
      zh: '供应商与库存',
      id: 'Pemasok & Barang',
    },
    description: {
      es: 'Compras de inventario, productos e insumos',
      en: 'Inventory purchases, wholesale goods, and raw supplies',
      fr: 'Achats de stock, produits et matières premières',
      de: 'Warenbeschaffung, Produkte und Vorräte',
      pt: 'Compras de estoque, insumos e matéria-prima',
      it: 'Acquisto merci, scorte e forniture aziendali',
      ja: '在庫仕入れ、製品調達、原材料の購入',
      zh: '商品采购、库存补给与原材料进货',
      id: 'Pembelian persediaan, barang dagangan dan bahan baku',
    },
  },
  'cat-biz-team': {
    name: {
      es: 'Sueldos & Equipo',
      en: 'Payroll & Team',
      fr: 'Salaires & Équipe',
      de: 'Gehälter & Team',
      pt: 'Salários & Equipe',
      it: 'Stipendi & Team',
      ja: '給与・チーム',
      zh: '薪资与团队',
      id: 'Gaji & Tim',
    },
    description: {
      es: 'Pagos al equipo, colaboradores y nómina',
      en: 'Staff payroll, contractors, bonuses, and team',
      fr: 'Salaires du personnel, prestataires et primes',
      de: 'Mitarbeiterlöhne, Freelancer und Gehälter',
      pt: 'Folha de pagamento, colaboradores e bônus',
      it: 'Buste paga dipendenti, collaboratori e compensi',
      ja: '従業員給与、業務委託費、チーム報酬',
      zh: '员工薪酬、顾问报酬与团队奖金',
      id: 'Gaji karyawan, honor staf dan komisi tim',
    },
  },
  'cat-biz-ops': {
    name: {
      es: 'Servicios & Oficina',
      en: 'Operations & Office',
      fr: 'Opérations & Bureau',
      de: 'Betrieb & Büro',
      pt: 'Operações & Escritório',
      it: 'Operazioni & Ufficio',
      ja: '運営・オフィス',
      zh: '运营与办公',
      id: 'Operasional & Kantor',
    },
    description: {
      es: 'Alquiler, luz, software, hosting y herramientas',
      en: 'Rent, electricity, SaaS software, hosting, and office tools',
      fr: 'Loyer bureau, logiciels SaaS, hébergement et outils',
      de: 'Miete, Strom, SaaS-Software, Hosting und Arbeitsmittel',
      pt: 'Aluguel comercial, luz, softwares SaaS e ferramentas',
      it: 'Affitto ufficio, utenze, software SaaS e hosting',
      ja: 'オフィス賃料、光熱費、クラウドツール、業務機材',
      zh: '办公场地租赁、云服务SaaS与日常运营耗材',
      id: 'Sewa tempat, listrik, software SaaS dan perlengkapan',
    },
  },
  'cat-biz-ads': {
    name: {
      es: 'Marketing & Publicidad',
      en: 'Marketing & Ads',
      fr: 'Marketing & Publicité',
      de: 'Marketing & Werbung',
      pt: 'Marketing & Publicidade',
      it: 'Marketing & Pubblicità',
      ja: '広告・マーケティング',
      zh: '营销与广告',
      id: 'Pemasaran & Iklan',
    },
    description: {
      es: 'Anuncios en redes, diseño, imprenta y captación',
      en: 'Social media ads, design, printing, and client acquisition',
      fr: 'Campagnes pub, design, flyers et acquisition clients',
      de: 'Werbeanzeigen, Grafikdesign und Kundengewinnung',
      pt: 'Anúncios online, design gráfico e captação de clientes',
      it: 'Campagne social ads, grafica e acquisizione clienti',
      ja: 'Web広告、デザイン制作、プロモーション集客費',
      zh: '数字化广告投放、品牌设计与获客推广',
      id: 'Iklan digital, promosi, desain dan akuisisi pelanggan',
    },
  },
  'cat-biz-taxes': {
    name: {
      es: 'Impuestos',
      en: 'Taxes & Compliance',
      fr: 'Impôts & Taxes',
      de: 'Steuern',
      pt: 'Impostos',
      it: 'Tasse & Imposte',
      ja: '税金',
      zh: '税费与合规',
      id: 'Pajak',
    },
    description: {
      es: 'Reserva legal para IVA, renta y obligaciones fiscales',
      en: 'Tax withholdings, VAT/Sales tax, and statutory filings',
      fr: 'Provision TVA, impôt sur les sociétés et taxes',
      de: 'Rücklage für Umsatzsteuer, Körperschaftsteuer und Abgaben',
      pt: 'Reserva para impostos, notas fiscais e obrigações',
      it: 'Accantonamento IVA, imposte sul reddito e tributi',
      ja: '消費税・法人税の納税引当準備金',
      zh: '增值税、企业所得税与法定合规预留款',
      id: 'Cadangan PPN, pajak penghasilan dan kewajiban legal',
    },
  },
  'cat-biz-profit': {
    name: {
      es: 'Ganancias & Utilidad',
      en: 'Profit & Retained',
      fr: 'Bénéfices & Dividendes',
      de: 'Gewinn & Rücklagen',
      pt: 'Lucro & Dividendos',
      it: 'Utili & Riserve',
      ja: '利益・内部留保',
      zh: '利润与留存',
      id: 'Laba & Keuntungan',
    },
    description: {
      es: 'Margen libre para los dueños, reinversión y dividendos',
      en: 'Net earnings, founder distributions, and re-investment',
      fr: 'Marge nette pour fondateurs, dividendes et réinvestissement',
      de: 'Gewinnausschüttung, Inhaberentnahmen und Rücklagen',
      pt: 'Margem líquida livre, dividendos e reinvestimento',
      it: 'Margine netto per i soci, dividendi e reinvestimento',
      ja: '事業主利益分配、配当金、再投資用プール資金',
      zh: '企业净盈余、股东分红与再投资储备',
      id: 'Laba bersih pemilik, dividen dan dana ekspansi usaha',
    },
  },
  // Legacy / 50-30-20 categories
  'cat-needs': {
    name: {
      es: 'Necesidades Básicas (50%)',
      en: 'Essential Needs (50%)',
      fr: 'Besoins Essentiels (50%)',
      de: 'Grundbedarf (50%)',
      pt: 'Necessidades Básicas (50%)',
      it: 'Bisogni Primari (50%)',
      ja: '生活必需費 (50%)',
      zh: '基础生活开支 (50%)',
      id: 'Kebutuhan Pokok (50%)',
    },
  },
  'cat-wants': {
    name: {
      es: 'Deseos & Estilo de Vida (30%)',
      en: 'Wants & Lifestyle (30%)',
      fr: 'Envies & Mode de Vie (30%)',
      de: 'Wünsche & Lebensstil (30%)',
      pt: 'Desejos & Estilo de Vida (30%)',
      it: 'Desideri & Stile di Vita (30%)',
      ja: '娯楽・ゆとり費 (30%)',
      zh: '品质生活与欲望 (30%)',
      id: 'Keinginan & Gaya Hidup (30%)',
    },
  },
  'cat-savings': {
    name: {
      es: 'Ahorro & Inversión (20%)',
      en: 'Savings & Investing (20%)',
      fr: 'Épargne & Investissement (20%)',
      de: 'Sparen & Investieren (20%)',
      pt: 'Poupança & Investimento (20%)',
      it: 'Risparmio & Investimenti (20%)',
      ja: '貯金・資産形成 (20%)',
      zh: '储蓄与长期投资 (20%)',
      id: 'Tabungan & Investasi (20%)',
    },
  },
};

// Also detect by canonical Spanish or English string names
const NAME_TO_ID_MAP: Record<string, string> = {
  'alimentación & supermercado': 'cat-pers-food',
  'food & groceries': 'cat-pers-food',
  'vivienda & renta': 'cat-pers-housing',
  'housing & rent': 'cat-pers-housing',
  'servicios & facturas': 'cat-pers-utilities',
  'utilities & bills': 'cat-pers-utilities',
  'transporte & movilidad': 'cat-pers-transport',
  'transport & commute': 'cat-pers-transport',
  'ocio & gustos': 'cat-pers-leisure',
  'leisure & entertainment': 'cat-pers-leisure',
  'ahorro & metas': 'cat-pers-savings',
  'savings & goals': 'cat-pers-savings',
  'proveedores & mercancía': 'cat-biz-inventory',
  'suppliers & inventory': 'cat-biz-inventory',
  'sueldos & equipo': 'cat-biz-team',
  'payroll & team': 'cat-biz-team',
  'servicios & oficina': 'cat-biz-ops',
  'operations & office': 'cat-biz-ops',
  'marketing & publicidad': 'cat-biz-ads',
  'marketing & ads': 'cat-biz-ads',
  'impuestos': 'cat-biz-taxes',
  'taxes & compliance': 'cat-biz-taxes',
  'taxes': 'cat-biz-taxes',
  'ganancias & utilidad': 'cat-biz-profit',
  'profit & retained': 'cat-biz-profit',
  'necesidades básicas': 'cat-needs',
  'essential needs': 'cat-needs',
  'deseos & estilo de vida': 'cat-wants',
  'wants & lifestyle': 'cat-wants',
  'ahorro & inversión': 'cat-savings',
  'savings & investing': 'cat-savings',
};

export function getLocalizedCategoryName(
  category: { id?: string; name: string },
  lang: LanguageCode = 'es'
): string {
  if (!category) return '';

  // 1. Direct ID lookup
  if (category.id && CATEGORY_LOCALIZATIONS[category.id]) {
    const loc = CATEGORY_LOCALIZATIONS[category.id].name;
    if (loc[lang]) return loc[lang];
  }

  // 2. Lookup by lowercase name match
  const cleanName = category.name.trim().toLowerCase();
  const matchedId = NAME_TO_ID_MAP[cleanName];
  if (matchedId && CATEGORY_LOCALIZATIONS[matchedId]) {
    const loc = CATEGORY_LOCALIZATIONS[matchedId].name;
    if (loc[lang]) return loc[lang];
  }

  // 3. Fallback to original custom category name
  return category.name;
}

export function getLocalizedCategoryDescription(
  category: { id?: string; name?: string; description?: string },
  lang: LanguageCode = 'es'
): string {
  if (!category) return '';

  if (category.id && CATEGORY_LOCALIZATIONS[category.id]?.description) {
    const loc = CATEGORY_LOCALIZATIONS[category.id].description!;
    if (loc[lang]) return loc[lang];
  }

  if (category.name) {
    const cleanName = category.name.trim().toLowerCase();
    const matchedId = NAME_TO_ID_MAP[cleanName];
    if (matchedId && CATEGORY_LOCALIZATIONS[matchedId]?.description) {
      const loc = CATEGORY_LOCALIZATIONS[matchedId].description!;
      if (loc[lang]) return loc[lang];
    }
  }

  return category.description || '';
}

const PRESET_LOCALIZATIONS: Record<
  string,
  { name: Record<LanguageCode, string>; description: Record<LanguageCode, string> }
> = {
  'preset-50-30-20': {
    name: {
      es: 'Regla 50/30/20 (Finanzas Clásicas)',
      en: '50/30/20 Rule (Classic)',
      fr: 'Règle 50/30/20 (Classique)',
      de: '50/30/20-Regel (Klassisch)',
      pt: 'Regra 50/30/20 (Clássica)',
      it: 'Regola 50/30/20 (Classica)',
      ja: '50/30/20の法則（定番）',
      zh: '50/30/20 法则（经典）',
      id: 'Aturan 50/30/20 (Klasik)',
    },
    description: {
      es: '50% Necesidades (Vivienda/Comida), 30% Deseos & Ocio, 20% Ahorro',
      en: '50% Needs (Food/Home), 30% Wants & Leisure, 20% Savings',
      fr: '50% Besoins essentiels, 30% Loisirs & Envies, 20% Épargne',
      de: '50% Grundbedarf (Wohnen/Essen), 30% Wünsche, 20% Sparen',
      pt: '50% Necessidades (Moradia/Comida), 30% Desejos, 20% Poupança',
      it: '50% Bisogni primari, 30% Svago & Desideri, 20% Risparmio',
      ja: '50% 必要生活費、30% 娯楽・自由費、20% 貯金',
      zh: '50% 刚需生活、30% 娱乐消费、20% 储蓄',
      id: '50% Kebutuhan, 30% Keinginan, 20% Tabungan',
    },
  },
  'preset-balanced-6': {
    name: {
      es: 'Gasti 6 Bolsitas (Equilibrado)',
      en: 'Gasti 6 Envelopes (Balanced)',
      fr: 'Gasti 6 Enveloppes (Équilibré)',
      de: 'Gasti 6 Umschläge (Ausgewogen)',
      pt: 'Gasti 6 Envelopes (Equilibrado)',
      it: 'Gasti 6 Buste (Bilanciato)',
      ja: 'Gasti 6つの袋（バランス配分）',
      zh: 'Gasti 6分法（科学均衡）',
      id: 'Gasti 6 Pos (Seimbang)',
    },
    description: {
      es: 'Distribución equilibrada entre comida, hogar, transporte y metas',
      en: 'Balanced spread across groceries, rent, transit, and savings',
      fr: 'Répartition équilibrée alimentation, logement, transport et projets',
      de: 'Ausgewogen verteilt auf Essen, Wohnen, Mobilität und Ziele',
      pt: 'Distribuição balanceada entre alimentação, moradia, transporte e metas',
      it: 'Distribuzione bilanciata tra cibo, casa, trasporti e mete future',
      ja: '食費、住居費、交通費、将来貯金の均等バランス',
      zh: '餐饮、住房、通勤与储蓄目标的平衡配置',
      id: 'Distribusi seimbang antara makanan, rumah, transportasi dan tujuan',
    },
  },
  'preset-heavy-savings': {
    name: {
      es: 'Ahorro Fuerte (30% Ahorro)',
      en: 'High Savings (30% Target)',
      fr: 'Forte Épargne (Objectif 30%)',
      de: 'Hohe Sparquote (30% Ziel)',
      pt: 'Poupança Forte (Meta 30%)',
      it: 'Forte Risparmio (Target 30%)',
      ja: '集中貯金（30% 目標）',
      zh: '极速储蓄（30% 目标）',
      id: 'Fokus Tabungan (Target 30%)',
    },
    description: {
      es: 'Maximiza el ahorro mensual reduciendo gastos secundarios',
      en: 'Maximize monthly savings by trimming discretionary spending',
      fr: 'Maximise l\'épargne en réduisant les dépenses superflues',
      de: 'Monatliche Ersparnisse maximieren durch Einsparung bei Freizeit',
      pt: 'Maximiza a poupança reduzindo gastos secundários',
      it: 'Massimizza i risparmi riducendo le spese non essenziali',
      ja: '余暇費を抑えて月々の貯蓄スピードを最大化',
      zh: '节制随意开支，实现每月高额储蓄积累',
      id: 'Maksimalkan tabungan bulanan dengan memangkas pos santai',
    },
  },
  'preset-70-20-10': {
    name: {
      es: 'Método 70/20/10',
      en: '70/20/10 Method',
      fr: 'Méthode 70/20/10',
      de: '70/20/10-Methode',
      pt: 'Método 70/20/10',
      it: 'Metodo 70/20/10',
      ja: '70/20/10 法',
      zh: '70/20/10 预算法',
      id: 'Metode 70/20/10',
    },
    description: {
      es: '70% Gastos diarios, 20% Ahorro o deudas, 10% Inversión o donación',
      en: '70% Living expenses, 20% Savings/debt payoff, 10% Growth',
      fr: '70% Vie courante, 20% Épargne/dettes, 10% Croissance',
      de: '70% Lebenshaltung, 20% Sparen/Schuldentilgung, 10% Zukunft',
      pt: '70% Despesas diárias, 20% Poupança/dívidas, 10% Futuro',
      it: '70% Spese quotidiane, 20% Risparmi/debiti, 10% Crescita',
      ja: '70% 日常生活費、20% 貯金または返済、10% 投資と成長',
      zh: '70% 日常生活、20% 储蓄还款、10% 增值与投资',
      id: '70% Biaya harian, 20% Tabungan/utang, 10% Pertumbuhan',
    },
  },
  'preset-biz-balanced': {
    name: {
      es: 'Reparto Negocio Equilibrado',
      en: 'Balanced Business Model',
      fr: 'Modèle Entreprise Équilibré',
      de: 'Ausgewogenes Geschäftsmodell',
      pt: 'Modelo Empresarial Equilibrado',
      it: 'Modello Business Equilibrato',
      ja: 'バランス型事業モデル',
      zh: '均衡企业财务模型',
      id: 'Model Bisnis Seimbang',
    },
    description: {
      es: 'Distribución balanceada de mercancía, nómina, gastos operativos y margen libre',
      en: 'Balanced spread of inventory, payroll, OPEX, and retained earnings',
      fr: 'Répartition équilibrée marchandises, salaires, OPEX et marge nette',
      de: 'Ausgewogen: Warenbeschaffung, Gehälter, OPEX und Reingewinn',
      pt: 'Distribuição balanceada entre estoque, salários, OPEX e lucro livre',
      it: 'Distribuzione bilanciata tra merci, stipendi, costi operativi e utile',
      ja: '仕入れ、人件費、運営費、手元利益の健全配分',
      zh: '平衡分配进货成本、薪酬、运营与自由利润',
      id: 'Distribusi seimbang barang, gaji, operasional dan laba bersih',
    },
  },
  'preset-biz-profit-first': {
    name: {
      es: 'Ganancia Primero (Profit First)',
      en: 'Profit First Accounting',
      fr: 'Profit First (Bénéfice Prioritaire)',
      de: 'Profit First (Gewinn Zuerst)',
      pt: 'Lucro Primeiro (Profit First)',
      it: 'Profit First (Utile al Primo Posto)',
      ja: 'プロフィット・ファースト（利益優先）',
      zh: '利润优先法（Profit First）',
      id: 'Profit First (Laba Terlebih Dahulu)',
    },
    description: {
      es: 'Garantiza un 15% de utilidad libre antes de repartir en operaciones',
      en: 'Secures a 15% net profit margin before funding daily operations',
      fr: 'Garantit 15% de marge nette avant d\'allouer aux opérations',
      de: 'Sichert 15% Gewinn vor der Zuweisung zu den Betriebsausgaben',
      pt: 'Garante 15% de lucro antes de custear as operações',
      it: 'Garantisce il 15% di margine netto prima di coprire i costi operativi',
      ja: '日々の経費を分配する前に確実に15%の手元利益を確保',
      zh: '在支付日常运营开支前，优先锁定15%净利润',
      id: 'Mengamankan margin laba 15% sebelum mendanai operasional harian',
    },
  },
  'preset-biz-service': {
    name: {
      es: 'Agencia / Servicios Digitales',
      en: 'Service / Digital Agency',
      fr: 'Agence / Services Digitaux',
      de: 'Agentur / Dienstleistungen',
      pt: 'Agência / Serviços Digitais',
      it: 'Agenzia / Servizi Digitali',
      ja: 'サービス業・デジタル代理店',
      zh: '服务型企业 / 数字机构',
      id: 'Agensi / Jasa Digital',
    },
    description: {
      es: 'Bajo costo de mercancía, fuerte inversión en talento y marketing',
      en: 'Low inventory costs, strong focus on team payroll and marketing',
      fr: 'Faible coût matière, fort accent sur les salaires et le marketing',
      de: 'Geringe Materialkosten, hoher Fokus auf Team und Marketing',
      pt: 'Baixo custo de insumos, foco total em equipe e marketing',
      it: 'Bassi costi merci, forte concentrazione su team e marketing',
      ja: '仕入れ原価を抑え、チーム人材とマーケティングに集中投資',
      zh: '低物料进货成本，重在团队薪酬与广告营销获客',
      id: 'Biaya barang minim, alokasi besar untuk tim dan pemasaran',
    },
  },
  'preset-biz-commerce': {
    name: {
      es: 'Comercio / Retail & Tienda',
      en: 'Retail & Physical Shop',
      fr: 'Commerce & Boutique',
      de: 'Einzelhandel & Geschäft',
      pt: 'Comércio / Varejo & Loja',
      it: 'Commercio al Dettaglio & Negozio',
      ja: '小売・店舗ビジネス',
      zh: '零售商贸与实体门店',
      id: 'Ritel & Toko Fisik',
    },
    description: {
      es: 'Prioriza proveedores, reposición de inventario y local comercial',
      en: 'Prioritizes inventory turnover, suppliers, and retail location',
      fr: 'Priorise les fournisseurs, le réassort et le point de vente',
      de: 'Schwerpunkt auf Lieferanten, Warennachschub und Verkaufsfläche',
      pt: 'Prioriza fornecedores, reposição de estoque e ponto comercial',
      it: 'Priorità a fornitori, scorte di magazzino e punto vendita',
      ja: '仕入れサプライヤー、在庫回転、店舗費用を最優先配分',
      zh: '重点保障供货商货款、库存周转与商铺租金',
      id: 'Prioritas pada pemasok, perputaran stok dan tempat toko',
    },
  },
};

export function getLocalizedPreset(preset: BudgetPreset, lang: LanguageCode = 'es'): BudgetPreset {
  if (!preset) return preset;
  const loc = PRESET_LOCALIZATIONS[preset.id];
  if (!loc) return preset;

  return {
    ...preset,
    name: loc.name[lang] || preset.name,
    description: loc.description[lang] || preset.description,
  };
}

export function getLocalizedCapitalSource(
  type: CapitalSourceType | string = 'capital',
  customLabel?: string,
  lang: LanguageCode = 'es'
): string {
  if (type === 'custom' && customLabel?.trim()) {
    return customLabel.trim();
  }

  const map: Record<string, Record<LanguageCode, string>> = {
    capital: {
      es: 'Capital a Repartir',
      en: 'Capital to Allocate',
      fr: 'Capital à Répartir',
      de: 'Verteilbares Kapital',
      pt: 'Capital a Distribuir',
      it: 'Capitale da Distribuire',
      ja: '配分する資金',
      zh: '待分配资金',
      id: 'Modal yang Dialokasikan',
    },
    salary: {
      es: 'Sueldo / Salario',
      en: 'Salary / Income',
      fr: 'Salaire / Revenu',
      de: 'Gehalt / Einkommen',
      pt: 'Salário / Renda',
      it: 'Stipendio / Entrata',
      ja: '給与・月給',
      zh: '工资 / 薪资',
      id: 'Gaji / Pemasukan',
    },
    investment: {
      es: 'Fondo de Inversión',
      en: 'Investment Fund',
      fr: 'Fonds d\'Investissement',
      de: 'Investitionsfonds',
      pt: 'Fundo de Investimento',
      it: 'Fondo di Investimento',
      ja: '投資資金',
      zh: '投资专款',
      id: 'Dana Investasi',
    },
    project: {
      es: 'Caja de Proyecto',
      en: 'Project Capital',
      fr: 'Budget Projet',
      de: 'Projektbudget',
      pt: 'Caixa de Projeto',
      it: 'Budget Progetto',
      ja: 'プロジェクト費',
      zh: '项目专款',
      id: 'Kas Proyek',
    },
    extra: {
      es: 'Bono / Extra',
      en: 'Bonus / Extra',
      fr: 'Prime / Extra',
      de: 'Bonus / Extra',
      pt: 'Bônus / Extra',
      it: 'Bonus / Extra',
      ja: '臨時収入・ボーナス',
      zh: '奖金 / 额外资金',
      id: 'Bonus / Ekstra',
    },
    budget: {
      es: 'Presupuesto Total',
      en: 'Total Budget',
      fr: 'Budget Total',
      de: 'Gesamtbudget',
      pt: 'Orçamento Total',
      it: 'Budget Totale',
      ja: '総予算',
      zh: '总预算',
      id: 'Total Anggaran',
    },
  };

  const entry = map[type];
  if (entry && entry[lang]) {
    return entry[lang];
  }
  return map.capital[lang] || 'Capital to Allocate';
}
