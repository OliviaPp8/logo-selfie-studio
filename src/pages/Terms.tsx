import Header from "@/components/Header";
import Footer from "@/components/Footer";
const Terms = () => {
  return <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8 mx-0 my-[19px]">




Terms & Conditions</h1>
        
        {/* Disclaimer Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">⚠️ Disclaimer</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 text-muted-foreground">
            <p>This is an <strong className="text-foreground">open-source research and demonstration project</strong>.</p>
            <ul className="list-disc list-inside space-y-2">
              <li>This project <strong className="text-foreground">does NOT include, provide, or distribute any real human facial data, portraits, or biometric information</strong>.</li>
              <li>All example data (if any) is <strong className="text-foreground">synthetic, AI-generated, or publicly available non-identifiable content</strong>.</li>
              <li>The project <strong className="text-foreground">does not collect, store, or process personal data by default</strong>.</li>
            </ul>
            <p>If you use this project with <strong className="text-foreground">real personal data (including but not limited to photos, videos, or biometric information)</strong>, you are solely responsible for:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>obtaining <strong className="text-foreground">explicit and lawful consent</strong> from the data subject;</li>
              <li>complying with all applicable laws and regulations (e.g. GDPR, PIPL, local privacy laws);</li>
              <li>any legal consequences arising from such usage.</li>
            </ul>
            <p className="font-semibold text-foreground">The authors and contributors DISCLAIM ALL LIABILITY for any misuse of this project.</p>
            <p className="text-primary font-medium">Use at your own risk.</p>
          </div>
        </section>

        {/* Terms of Service Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">📜 Terms of Service</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-6 text-muted-foreground">
            <p>By accessing or using this project, you agree to the following terms:</p>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">1. Intended Use</h3>
              <p>This project is provided for <strong className="text-foreground">research, educational, and experimental purposes only</strong>.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">2. User-Provided Content</h3>
              <p className="mb-2">You may choose to upload or provide content to the system. You represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You <strong className="text-foreground">own</strong> the content or have obtained <strong className="text-foreground">explicit authorization</strong> to use it;</li>
                <li>If the content includes <strong className="text-foreground">personal data, portraits, or biometric information</strong>, you have obtained <strong className="text-foreground">clear and informed consent</strong> from the data subject;</li>
                <li>Your use complies with all applicable laws and regulations.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">3. Prohibited Use</h3>
              <p className="mb-2">You agree NOT to use this project to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>process or generate content involving individuals <strong className="text-foreground">without their consent</strong>;</li>
                <li>create impersonation, deepfake, or misleading representations;</li>
                <li>violate privacy, publicity, or personality rights;</li>
                <li>engage in unlawful, harmful, or deceptive activities.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">4. No Data Retention Guarantee</h3>
              <p>Unless explicitly stated, this project <strong className="text-foreground">does not guarantee data storage, persistence, or deletion policies</strong>.</p>
              <p>Users should assume all processing is <strong className="text-foreground">stateless and ephemeral</strong>.</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">5. Disclaimer of Liability</h3>
              <p className="mb-2">The project is provided <strong className="text-foreground">"AS IS"</strong>, without warranties of any kind. The authors and contributors shall not be liable for:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>misuse of the project;</li>
                <li>unlawful data processing by users;</li>
                <li>damages arising from generated content.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">6. Responsibility</h3>
              <p>You are solely responsible for your use of this project and any outputs generated.</p>
              <p className="font-semibold text-primary">If you do not agree with these terms, do not use this project.</p>
            </div>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">🔒 Privacy Policy</h2>
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 text-muted-foreground">
            <p>This project does not intentionally collect, store, or share personal data.</p>
            <p>If users voluntarily provide data:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Data is processed only for the purpose explicitly requested by the user;</li>
              <li>The project does not claim ownership over user-provided content;</li>
              <li>Users are responsible for ensuring lawful data usage.</li>
            </ul>
            <p>We recommend users <strong className="text-foreground">avoid uploading personal or sensitive data</strong> unless necessary and properly authorized.</p>
            <p>For questions regarding privacy, please contact the project maintainer.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Terms;