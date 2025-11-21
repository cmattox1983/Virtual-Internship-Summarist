"use client";
import React, { useState } from "react";
import styles from "./Plan.module.css";
import { FaFileLines, FaSeedling, FaHandshake } from "react-icons/fa6";
import { FaAngleDown, FaCircleNotch } from "react-icons/fa";
import { getCheckoutURL } from "@/app/Payment/StripePayment";

export default function Plan() {
  type Option = "top" | "bottom";
  type FAQ = "first" | "second" | "third" | "fourth";
  const [selected, setSelected] = useState<Option>("top");
  const [clicked, setClicked] = useState<FAQ | null>("first");
  const [loading, setLoading] = useState(false);

  const handleClicked = (faq: FAQ) => {
    setClicked((prev) => (prev === faq ? null : faq));
  };

  const monthlyPriceId = "price_1STNM78LDp7BgYMLFZMP0tyQ";
  const annualPriceId = "price_1STRGH8LDp7BgYMLukdA59xi";

  const startCheckout = async (priceId: string) => {
    setLoading(true);
    await getCheckoutURL(priceId);
  };

  return (
    <>
      <div className="row">
        <div className="container">
          <div className={styles["plan__features--wrapper"]}>
            <div className={styles.plan__features}>
              <figure className={styles["plan__features--icon"]}>
                <FaFileLines className={styles["plan__features--icon-svg"]} />
              </figure>
              <div className={styles["plan__features--text"]}>
                <b>Key ideas in few min</b> with many books to read
              </div>
            </div>
            <div className={styles.plan__features}>
              <figure className={styles["plan__features--icon"]}>
                <FaSeedling className={styles["plan__features--icon-svg"]} />
              </figure>
              <div className={styles["plan__features--text"]}>
                <b>3 million</b> people growing with Summarist everyday
              </div>
            </div>
            <div className={styles.plan__features}>
              <figure className={styles["plan__features--icon"]}>
                <FaHandshake className={styles["plan__features--icon-svg"]} />
              </figure>
              <div className={styles["plan__features--text"]}>
                <b>Precise recommendations</b> collections curated by experts
              </div>
            </div>
          </div>
          <div className="section__title">Choose the plan that fits you</div>
          <div
            onClick={() => setSelected("top")}
            className={`${styles.plan__card} ${
              selected === "top" ? styles["plan__card--active"] : ""
            }`}
          >
            <div className={styles["plan__card--circle"]}>
              {selected === "top" && (
                <div className={styles["plan__card--dot"]}></div>
              )}
            </div>
            <div className={styles["plan__card--content"]}>
              <div className={styles["plan__card--title"]}>
                Premium Plus Yearly
              </div>
              <div className={styles["plan__card--price"]}>$99.99/year</div>
              <div className={styles["plan__card--text"]}>
                7-day free trial included
              </div>
            </div>
          </div>
          <div className={styles["plan__card--separator"]}>
            <div className="plan__separator">or</div>
          </div>
          <div
            onClick={() => setSelected("bottom")}
            className={`${styles.plan__card} ${
              selected === "bottom" ? styles["plan__card--active"] : ""
            }`}
          >
            <div className={styles["plan__card--circle"]}>
              {selected === "bottom" && (
                <div className={styles["plan__card--dot"]}></div>
              )}
            </div>
            <div className={styles["plan__card--content"]}>
              <div className={styles["plan__card--title"]}>
                Premium Plus Monthly
              </div>
              <div className={styles["plan__card--price"]}>$9.99/month</div>
              <div className={styles["plan__card--text"]}>
                No trial included
              </div>
            </div>
          </div>

          {selected === "top" ? (
            <div className={styles["plan__card--cta"]}>
              <span className="btn--wrapper">
                <button
                  className="btn"
                  style={{ width: "300px" }}
                  onClick={() => startCheckout(annualPriceId)}
                >
                  {loading ? (
                    <div className="spinner__icon--wrapper">
                      <FaCircleNotch className="spinner__icon--wrapper-svg" />
                    </div>
                  ) : (
                    <span>Start your free 7-day trial</span>
                  )}
                </button>
              </span>
              <div className={styles.plan__disclaimer}>
                Cancel your trial at any time before it ends, and you won’t be
                charged.
              </div>
            </div>
          ) : (
            <div className={styles["plan__card--cta"]}>
              <span className="btn--wrapper">
                <button
                  className="btn"
                  style={{ width: "300px" }}
                  onClick={() => startCheckout(monthlyPriceId)}
                >
                  {loading ? (
                    <div className="spinner__icon--wrapper">
                      <FaCircleNotch className="spinner__icon--wrapper-svg" />
                    </div>
                  ) : (
                    <span>Start your first month</span>
                  )}
                </button>
              </span>
              <div className={styles.plan__disclaimer}>
                30-day money back guarantee, no questions asked.
              </div>
            </div>
          )}
          <div className="faq__wrapper">
            <div className={styles.accordion__card}>
              <div
                className={styles.accordion__header}
                onClick={() => handleClicked("first")}
              >
                <div className={styles.accordion__title}>
                  How does the free 7-day trial work?
                </div>
                <FaAngleDown
                  className={`${styles.accordion__icon} ${
                    clicked === "first" ? styles["accordion__icon--rotate"] : ""
                  }`}
                />
              </div>
              <div
                className={`${styles.collapse} ${
                  clicked === "first" ? styles.show : ""
                }`}
              >
                <div className={styles.accordion__body}>
                  Begin your complimentary 7-day trial with a Summarist annual
                  membership. You are under no obligation to continue your
                  subscription, and you will only be billed when the trial
                  period expires. With Premium access, you can learn at your own
                  pace and as frequently as you desire, and you may terminate
                  your subscription prior to the conclusion of the 7-day free
                  trial.
                </div>
              </div>
            </div>
            <div className={styles.accordion__card}>
              <div
                className={styles.accordion__header}
                onClick={() => handleClicked("second")}
              >
                <div className={styles.accordion__title}>
                  Can I switch subscriptions from monthly to yearly, or yearly
                  to monthly?
                </div>
                <FaAngleDown
                  className={`${styles.accordion__icon} ${
                    clicked === "second"
                      ? styles["accordion__icon--rotate"]
                      : ""
                  }`}
                />
              </div>
              <div
                className={`${styles.collapse} ${
                  clicked === "second" ? styles.show : ""
                }`}
              >
                <div className={styles.accordion__body}>
                  While an annual plan is active, it is not feasible to switch
                  to a monthly plan. However, once the current month ends,
                  transitioning from a monthly plan to an annual plan is an
                  option.
                </div>
              </div>
            </div>
            <div className={styles.accordion__card}>
              <div
                className={styles.accordion__header}
                onClick={() => handleClicked("third")}
              >
                <div className={styles.accordion__title}>
                  What's included in the Premium plan?
                </div>
                <FaAngleDown
                  className={`${styles.accordion__icon} ${
                    clicked === "third" ? styles["accordion__icon--rotate"] : ""
                  }`}
                />
              </div>
              <div
                className={`${styles.collapse} ${
                  clicked === "third" ? styles.show : ""
                }`}
              >
                <div className={styles.accordion__body}>
                  Premium membership provides you with the ultimate Summarist
                  experience, including unrestricted entry to many best-selling
                  books high-quality audio, the ability to download titles for
                  offline reading, and the option to send your reads to your
                  Kindle.
                </div>
              </div>
            </div>
            <div className={styles.accordion__card}>
              <div
                className={styles.accordion__header}
                onClick={() => handleClicked("fourth")}
              >
                <div className={styles.accordion__title}>
                  Can I cancel during my trial or subscription?
                </div>
                <FaAngleDown
                  className={`${styles.accordion__icon} ${
                    clicked === "fourth"
                      ? styles["accordion__icon--rotate"]
                      : ""
                  }`}
                />
              </div>
              <div
                className={`${styles.collapse} ${
                  clicked === "fourth" ? styles.show : ""
                }`}
              >
                <div className={styles.accordion__body}>
                  You will not be charged if you cancel your trial before its
                  conclusion. While you will not have complete access to the
                  entire Summarist library, you can still expand your knowledge
                  with one curated book per day.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
