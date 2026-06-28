import styles from './Services.module.scss'
import Title from "@/app/[locale]/components/title/Title"

const Services = () => {
  return (
    <section className={styles.servicesSection}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.description}>
            <p className={styles.meta}>§ 03 — послуги</p>
            <div className={styles.info}>
              <Title title="h2" className={styles.title}>
                Від отримання ліцензії до повного комплаєнсу
              </Title>
              <p className={styles.text}>
                10 послуг у трьох кластерах. Більшість доступна одночасно у трьох юрисдикціях:
                Україна (НБУ, НКЦПФР), країни ЄС (PSD2, EMD2, MiCA) і Великобританія (FCA, PRA).
              </p>
            </div>
          </div>

          {/* 👇 Новий блок нижче description */}
          <div className={styles.cluster}>
            <h3 className={styles.clusterTitle}>Ліцензування і капітал</h3>
            <div className={styles.services}>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Отримання ліцензій</h4>
                <p className={styles.servicesDesc}>
                  Повний цикл супроводу — від вибору юрисдикції до подачі заявки регулятору.
                  Банки, страхові, фінкомпанії, EMI, PSP, CASP, UK FCA-ліцензії.
                </p>
              </article>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Погодження істотної участі</h4>
                <p className={styles.servicesDesc}>
                  Дозволи регулятора на набуття участі у фінансовій установі. Перевірка акціонерів, джерел коштів, бенефіціарної структури.
                </p>
              </article>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Погодження капіталізації</h4>
                <p className={styles.servicesDesc}>
                  Збільшення статутного капіталу, додаткова емісія акцій, докапіталізація з погодженням регулятора. CRR/CRD у ЄС, FCA у UK.
                </p>
              </article>

            </div>
          </div>
          <div className={styles.cluster}>
            <h3 className={styles.clusterTitle}>Керівники і команда</h3>
            <div className={styles.services}>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Підготовка керівників до погодження у регуляторі</h4>
                <p className={styles.servicesDesc}>
                  CCO, CAO, CRO та інші ключові керівники: документи, тестування, mock-співбесіди. Включно з UK SMCR (Senior Management Functions).
                </p>
              </article>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Рекрутинг CCO/CAO/CRO та аутстафінг</h4>
                <p className={styles.servicesDesc}>
                  Підбір комплаєнс-команди з розумінням fit-and-proper requirements регулятора. Outsourced MLRO для стартапів і малих установ.
                </p>
              </article>

            </div>
          </div>
          <div className={styles.cluster}>
            <h3 className={styles.clusterTitle}>Governance і комплаєнс</h3>
            <div className={styles.services}>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Корпоративне управління</h4>
                <p className={styles.servicesDesc}>
                  Аудит та налаштування з нуля. NBU, EBA Guidelines, FCA SYSC, FRC Code.
                </p>
              </article>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Внутрішній контроль (3LoD)</h4>
                <p className={styles.servicesDesc}>
                  Three Lines of Defence: бізнес-процеси → ризик-менеджмент і комплаєнс → внутрішній аудит.
                </p>
              </article>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Комплаєнс-перевірки компанії</h4>
                <p className={styles.servicesDesc}>
                  Незалежний аудит: AML/CFT, KYC, sanctions (OFSI, OFAC), GDPR / UK GDPR, FCA Consumer Duty.
                </p>
              </article>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Комплаєнс продукту</h4>
                <p className={styles.servicesDesc}>
                  Перевірка фінансового продукту: чи потрібна ліцензія, user flow, маркетинг, fee disclosure, скарги і диспути.
                </p>
              </article>
              <article className={styles.servicesCard}>
                <h4 className={styles.servicesTitle}>Консультування з ліцензування</h4>
                <p className={styles.servicesDesc}>
                  Швидкі консультації, юридичні висновки, абонентка. Вибір юрисдикції, відповіді на запити НБУ/FCA, due diligence.
                </p>
              </article>

            </div>
          </div>
          <div className={styles.notice}>
            <strong className={styles.noticeTitle}>Важливо.</strong>
            <p className={styles.noticeText}>
              HARLIB не є реєстратором ліцензій ЄС/Великобританії і не входить до складу регуляторів.
              Рішення про видачу ліцензії приймає виключно компетентний орган обраної країни.
              Ми не гарантуємо конкретного результату — гарантуємо якість підготовки документів
              і ефективність комунікації з регулятором.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Services
