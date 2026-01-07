import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 mx-0 my-[19px]">
          {t("terms.title")}
        </h1>
        
        {/* Disclaimer Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">{t("terms.disclaimer.title")}</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 text-muted-foreground">
            <p><strong className="text-foreground">{t("terms.disclaimer.intro")}</strong></p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-foreground">{t("terms.disclaimer.noData")}</strong></li>
              <li><strong className="text-foreground">{t("terms.disclaimer.synthetic")}</strong></li>
              <li><strong className="text-foreground">{t("terms.disclaimer.noCollect")}</strong></li>
            </ul>
            <p><strong className="text-foreground">{t("terms.disclaimer.responsible")}</strong></p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong className="text-foreground">{t("terms.disclaimer.consent")}</strong></li>
              <li><strong className="text-foreground">{t("terms.disclaimer.comply")}</strong></li>
              <li><strong className="text-foreground">{t("terms.disclaimer.consequences")}</strong></li>
            </ul>
            <p className="font-semibold text-foreground">{t("terms.disclaimer.liability")}</p>
            <p className="text-primary font-medium">{t("terms.disclaimer.risk")}</p>
          </div>
        </section>

        {/* Terms of Service Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">{t("terms.tos.title")}</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-6 text-muted-foreground">
            <p>{t("terms.tos.intro")}</p>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("terms.tos.use.title")}</h3>
              <p><strong className="text-foreground">{t("terms.tos.use.content")}</strong></p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("terms.tos.content.title")}</h3>
              <p className="mb-2">{t("terms.tos.content.intro")}</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-foreground">{t("terms.tos.content.own")}</strong></li>
                <li><strong className="text-foreground">{t("terms.tos.content.personal")}</strong></li>
                <li><strong className="text-foreground">{t("terms.tos.content.comply")}</strong></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("terms.tos.prohibited.title")}</h3>
              <p className="mb-2">{t("terms.tos.prohibited.intro")}</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-foreground">{t("terms.tos.prohibited.noConsent")}</strong></li>
                <li>{t("terms.tos.prohibited.deepfake")}</li>
                <li>{t("terms.tos.prohibited.privacy")}</li>
                <li>{t("terms.tos.prohibited.unlawful")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("terms.tos.retention.title")}</h3>
              <p><strong className="text-foreground">{t("terms.tos.retention.content1")}</strong></p>
              <p><strong className="text-foreground">{t("terms.tos.retention.content2")}</strong></p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("terms.tos.liability.title")}</h3>
              <p className="mb-2"><strong className="text-foreground">{t("terms.tos.liability.intro")}</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>{t("terms.tos.liability.misuse")}</li>
                <li>{t("terms.tos.liability.unlawful")}</li>
                <li>{t("terms.tos.liability.damages")}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t("terms.tos.responsibility.title")}</h3>
              <p>{t("terms.tos.responsibility.content")}</p>
              <p className="font-semibold text-primary">{t("terms.tos.responsibility.disagree")}</p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">{t("terms.privacy.title")}</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 text-muted-foreground">
            <p>{t("terms.privacy.noCollect")}</p>
            <p>{t("terms.privacy.voluntary")}</p>
            <ul className="list-disc list-inside space-y-2">
              <li>{t("terms.privacy.purpose")}</li>
              <li>{t("terms.privacy.noOwnership")}</li>
              <li>{t("terms.privacy.responsible")}</li>
            </ul>
            <p><strong className="text-foreground">{t("terms.privacy.recommend")}</strong></p>
            <p>{t("terms.privacy.contact")}</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
