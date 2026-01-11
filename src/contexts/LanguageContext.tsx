import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "header.title": "BinanceLife",
    
    // Hero Section
    "hero.badge": "Your Binance Life AI Photo Generator 🤳",
    "hero.title1": "Take a Photo with",
    "hero.title2": "Binance Icons",
    "hero.description": "Upload your full-body photo and pose next to binance ecosystem logos! Perfect for social media, memes, or just for fun!",
    
    // Main Editor
    "editor.step1": "Upload & Select",
    "editor.step2": "Your Creation",
    "editor.uploadLabel": "Your Photo",
    "editor.selectProject": "Select a project",
    "editor.selectPlaceholder": "Choose a Binance icon...",
    "editor.withCZ": "Photo with CZ",
    "editor.generating": "Generating...",
    "editor.generateButton": "Create BinanceLife Photo",
    "editor.vibeButton": "Vibe Checking",
    "editor.templateComingSoon": "Template Coming Soon",
    
    // Pro Tips
    "tips.title": "💡 Pro Tips",
    "tips.tip1": "Use a full-body, front-facing photo for best results",
    "tips.tip2": "Photos with plain backgrounds work better",
    "tips.tip3": "AI will match lighting and perspective automatically",
    
    // Photo Uploader
    "uploader.dropHere": "Drop your photo here",
    "uploader.uploadPhoto": "Upload your photo",
    "uploader.dragDrop": "Drag & drop or click to browse",
    "uploader.optimizing": "Optimizing photo…",
    "uploader.ready": "Photo ready",
    "uploader.failed": "Failed to process photo",
    
    // Preview Section
    "preview.label": "Preview",
    "preview.generating": "Generating your image...",
    "preview.wait": "This may take a moment",
    "preview.yourPhoto": "Your Photo",
    "preview.placeholder": "Your preview will appear here",
    "preview.download": "Download",
    "preview.share": "Share",
    
    // Footer
    "footer.madeWith": "Made with",
    "footer.forFun": "for fun",
    "footer.terms": "Terms of Conditions",
    "footer.copyright": "BinanceLife. All company logos belong to their respective owners.",
    
    // 404 Page
    "notFound.title": "404",
    "notFound.message": "Oops! Page not found",
    "notFound.return": "Return to Home",
    
    // Terms Page
    "terms.title": "Terms & Conditions",
    "terms.disclaimer.title": "⚠️ Disclaimer",
    "terms.disclaimer.intro": "This is an open-source research and demonstration project.",
    "terms.disclaimer.noData": "This project does NOT include, provide, or distribute any real human facial data, portraits, or biometric information.",
    "terms.disclaimer.synthetic": "All example data (if any) is synthetic, AI-generated, or publicly available non-identifiable content.",
    "terms.disclaimer.noCollect": "The project does not collect, store, or process personal data by default.",
    "terms.disclaimer.responsible": "If you use this project with real personal data (including but not limited to photos, videos, or biometric information), you are solely responsible for:",
    "terms.disclaimer.consent": "obtaining explicit and lawful consent from the data subject;",
    "terms.disclaimer.comply": "complying with all applicable laws and regulations (e.g. GDPR, PIPL, local privacy laws);",
    "terms.disclaimer.consequences": "any legal consequences arising from such usage.",
    "terms.disclaimer.liability": "The authors and contributors DISCLAIM ALL LIABILITY for any misuse of this project.",
    "terms.disclaimer.risk": "Use at your own risk.",
    "terms.tos.title": "📜 Terms of Service",
    "terms.tos.intro": "By accessing or using this project, you agree to the following terms:",
    "terms.tos.use.title": "1. Intended Use",
    "terms.tos.use.content": "This project is provided for research, educational, and experimental purposes only.",
    "terms.tos.content.title": "2. User-Provided Content",
    "terms.tos.content.intro": "You may choose to upload or provide content to the system. You represent and warrant that:",
    "terms.tos.content.own": "You own the content or have obtained explicit authorization to use it;",
    "terms.tos.content.personal": "If the content includes personal data, portraits, or biometric information, you have obtained clear and informed consent from the data subject;",
    "terms.tos.content.comply": "Your use complies with all applicable laws and regulations.",
    "terms.tos.prohibited.title": "3. Prohibited Use",
    "terms.tos.prohibited.intro": "You agree NOT to use this project to:",
    "terms.tos.prohibited.noConsent": "process or generate content involving individuals without their consent;",
    "terms.tos.prohibited.deepfake": "create impersonation, deepfake, or misleading representations;",
    "terms.tos.prohibited.privacy": "violate privacy, publicity, or personality rights;",
    "terms.tos.prohibited.unlawful": "engage in unlawful, harmful, or deceptive activities.",
    "terms.tos.retention.title": "4. No Data Retention Guarantee",
    "terms.tos.retention.content1": "Unless explicitly stated, this project does not guarantee data storage, persistence, or deletion policies.",
    "terms.tos.retention.content2": "Users should assume all processing is stateless and ephemeral.",
    "terms.tos.liability.title": "5. Disclaimer of Liability",
    "terms.tos.liability.intro": 'The project is provided "AS IS", without warranties of any kind. The authors and contributors shall not be liable for:',
    "terms.tos.liability.misuse": "misuse of the project;",
    "terms.tos.liability.unlawful": "unlawful data processing by users;",
    "terms.tos.liability.damages": "damages arising from generated content.",
    "terms.tos.responsibility.title": "6. Responsibility",
    "terms.tos.responsibility.content": "You are solely responsible for your use of this project and any outputs generated.",
    "terms.tos.responsibility.disagree": "If you do not agree with these terms, do not use this project.",
    "terms.privacy.title": "🔒 Privacy Policy",
    "terms.privacy.noCollect": "This project does not intentionally collect, store, or share personal data.",
    "terms.privacy.voluntary": "If users voluntarily provide data:",
    "terms.privacy.purpose": "Data is processed only for the purpose explicitly requested by the user;",
    "terms.privacy.noOwnership": "The project does not claim ownership over user-provided content;",
    "terms.privacy.responsible": "Users are responsible for ensuring lawful data usage.",
    "terms.privacy.recommend": "We recommend users avoid uploading personal or sensitive data unless necessary and properly authorized.",
    "terms.privacy.contact": "For questions regarding privacy, please contact the project maintainer.",
  },
  zh: {
    // Header
    "header.title": "币安人生BinanceLife",
    
    // Hero Section
    "hero.badge": "您的币安人生自拍AI生成器🤳",
    "hero.title1": "",
    "hero.title2": "与币安Logo和人物合影",
    "hero.description": "上传您的全身照，与币安生态系统标志合影！非常适合社交媒体、表情包或纯粹的娱乐！",
    
    // Main Editor
    "editor.step1": "上传 & 选择",
    "editor.step2": "您的作品",
    "editor.uploadLabel": "您的照片",
    "editor.selectProject": "选择项目",
    "editor.selectPlaceholder": "选择一个币安图标...",
    "editor.withCZ": "与 CZ 合影",
    "editor.generating": "生成中...",
    "editor.generateButton": "生成币安人生照片",
    "editor.vibeButton": "Vibe一下",
    "editor.templateComingSoon": "模板即将推出",
    
    // Pro Tips
    "tips.title": "💡 小贴士",
    "tips.tip1": "使用正面全身照效果最佳",
    "tips.tip2": "纯色背景的照片效果更好",
    "tips.tip3": "AI将自动匹配光线和透视效果",
    
    // Photo Uploader
    "uploader.dropHere": "将照片拖放到这里",
    "uploader.uploadPhoto": "上传您的照片",
    "uploader.dragDrop": "拖放或点击浏览",
    "uploader.optimizing": "正在优化照片…",
    "uploader.ready": "照片已准备好",
    "uploader.failed": "处理照片失败",
    
    // Preview Section
    "preview.label": "预览",
    "preview.generating": "正在生成您的图片...",
    "preview.wait": "这可能需要一点时间",
    "preview.yourPhoto": "您的照片",
    "preview.placeholder": "预览将在这里显示",
    "preview.download": "下载",
    "preview.share": "分享",
    
    // Footer
    "footer.madeWith": "用",
    "footer.forFun": "制作，只为好玩",
    "footer.terms": "使用条款",
    "footer.copyright": "币安人生。所有公司标志均属于其各自所有者。",
    
    // 404 Page
    "notFound.title": "404",
    "notFound.message": "哎呀！页面未找到",
    "notFound.return": "返回首页",
    
    // Terms Page
    "terms.title": "使用条款",
    "terms.disclaimer.title": "⚠️ 免责声明",
    "terms.disclaimer.intro": "这是一个开源的研究和演示项目。",
    "terms.disclaimer.noData": "本项目不包含、提供或分发任何真实的人脸数据、肖像或生物特征信息。",
    "terms.disclaimer.synthetic": "所有示例数据（如有）均为合成的、AI生成的或公开可用的非可识别内容。",
    "terms.disclaimer.noCollect": "本项目默认不收集、存储或处理个人数据。",
    "terms.disclaimer.responsible": "如果您使用本项目处理真实个人数据（包括但不限于照片、视频或生物特征信息），您需自行负责：",
    "terms.disclaimer.consent": "获得数据主体的明确且合法的同意；",
    "terms.disclaimer.comply": "遵守所有适用的法律法规（如GDPR、个人信息保护法、当地隐私法律）；",
    "terms.disclaimer.consequences": "因此类使用而产生的任何法律后果。",
    "terms.disclaimer.liability": "作者和贡献者对本项目的任何滥用不承担任何责任。",
    "terms.disclaimer.risk": "风险自负。",
    "terms.tos.title": "📜 服务条款",
    "terms.tos.intro": "访问或使用本项目即表示您同意以下条款：",
    "terms.tos.use.title": "1. 预期用途",
    "terms.tos.use.content": "本项目仅供研究、教育和实验目的使用。",
    "terms.tos.content.title": "2. 用户提供的内容",
    "terms.tos.content.intro": "您可以选择上传或向系统提供内容。您声明并保证：",
    "terms.tos.content.own": "您拥有该内容或已获得明确授权使用它；",
    "terms.tos.content.personal": "如果内容包含个人数据、肖像或生物特征信息，您已获得数据主体的明确知情同意；",
    "terms.tos.content.comply": "您的使用符合所有适用的法律法规。",
    "terms.tos.prohibited.title": "3. 禁止用途",
    "terms.tos.prohibited.intro": "您同意不使用本项目来：",
    "terms.tos.prohibited.noConsent": "处理或生成未经同意的个人内容；",
    "terms.tos.prohibited.deepfake": "创建冒充、深度伪造或误导性表述；",
    "terms.tos.prohibited.privacy": "侵犯隐私权、公开权或人格权；",
    "terms.tos.prohibited.unlawful": "从事非法、有害或欺骗性活动。",
    "terms.tos.retention.title": "4. 无数据保留保证",
    "terms.tos.retention.content1": "除非明确说明，本项目不保证数据存储、持久性或删除策略。",
    "terms.tos.retention.content2": "用户应假定所有处理都是无状态和临时的。",
    "terms.tos.liability.title": "5. 责任免除",
    "terms.tos.liability.intro": "本项目按\"原样\"提供，不提供任何形式的保证。作者和贡献者不对以下情况承担责任：",
    "terms.tos.liability.misuse": "项目的滥用；",
    "terms.tos.liability.unlawful": "用户的非法数据处理；",
    "terms.tos.liability.damages": "生成内容造成的损害。",
    "terms.tos.responsibility.title": "6. 责任",
    "terms.tos.responsibility.content": "您对使用本项目及生成的任何输出承担全部责任。",
    "terms.tos.responsibility.disagree": "如果您不同意这些条款，请勿使用本项目。",
    "terms.privacy.title": "🔒 隐私政策",
    "terms.privacy.noCollect": "本项目不会故意收集、存储或共享个人数据。",
    "terms.privacy.voluntary": "如果用户自愿提供数据：",
    "terms.privacy.purpose": "数据仅用于用户明确请求的目的；",
    "terms.privacy.noOwnership": "本项目不主张对用户提供的内容拥有所有权；",
    "terms.privacy.responsible": "用户有责任确保合法的数据使用。",
    "terms.privacy.recommend": "我们建议用户避免上传个人或敏感数据，除非必要且获得适当授权。",
    "terms.privacy.contact": "如有隐私相关问题，请联系项目维护者。",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "zh";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
