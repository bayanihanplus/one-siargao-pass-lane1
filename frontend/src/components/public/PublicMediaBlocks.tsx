import Link from "next/link";

type PublicVideoHeroProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
};

type PublicMediaBannerProps = {
  eyebrow: string;
  title: string;
  body: string;
  variant?: "traveler" | "trails" | "operator" | "partner" | "government" | "support";
  items?: string[];
};

export function PublicVideoHero(props: PublicVideoHeroProps) {
  return (
    <section className="osp-public-video-hero">
      <div className="osp-public-video-copy">
        {props.eyebrow ? <p className="osp-public-eyebrow">{props.eyebrow}</p> : null}
        <h1>{props.title}</h1>
        <p>{props.subtitle}</p>

        {(props.primaryCta || props.secondaryCta) ? (
          <div className="osp-public-video-actions">
            {props.primaryCta ? (
              <Link href={props.primaryCta.href} className="osp-public-primary-button">
                {props.primaryCta.label}
              </Link>
            ) : null}
            {props.secondaryCta ? (
              <Link href={props.secondaryCta.href} className="osp-public-secondary-button">
                {props.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="osp-public-video-panel" aria-label="One Siargao Pass video preview">
        <div className="osp-public-video-frame">
          <div className="osp-public-video-overlay">
            <span className="osp-public-video-pill">OSP Destination Layer</span>
            <strong>Island journey, pass readiness, partner coordination, and governed visibility.</strong>
          </div>

          <div className="osp-public-video-play">
            <span>▶</span>
          </div>

          <div className="osp-public-video-timeline">
            <span />
          </div>
        </div>

        <div className="osp-public-video-caption-grid">
          <article>
            <strong>Travelers</strong>
            <span>Pass, QR, trips, and Passport Map</span>
          </article>
          <article>
            <strong>Operators</strong>
            <span>Verified services and records</span>
          </article>
          <article>
            <strong>LGU / DOT</strong>
            <span>Protected coordination access</span>
          </article>
        </div>
      </div>
    </section>
  );
}

export function PublicMediaBanner(props: PublicMediaBannerProps) {
  const items = props.items || [];

  return (
    <section className={`osp-public-media-banner osp-public-media-${props.variant || "traveler"}`}>
      <div>
        <p className="osp-public-eyebrow">{props.eyebrow}</p>
        <h2>{props.title}</h2>
        <p>{props.body}</p>
      </div>

      <aside className="osp-public-media-card">
        <div className="osp-public-media-orbit">
          <span />
          <span />
          <span />
        </div>

        <div className="osp-public-media-list">
          {items.map((item) => (
            <div key={item}>
              <span />
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}


type PublicStaticBannerProps = {
  eyebrow: string;
  title: string;
  body: string;
  variant?: "home" | "traveler" | "trails" | "operator" | "partner" | "government" | "support";
  badge?: string;
  points?: string[];
};

export function PublicStaticBanner(props: PublicStaticBannerProps) {
  const points = props.points || [];

  return (
    <section className={`osp-public-static-banner osp-public-static-${props.variant || "home"}`}>
      <div className="osp-public-static-copy">
        <p className="osp-public-eyebrow">{props.eyebrow}</p>
        <h2>{props.title}</h2>
        <p>{props.body}</p>
      </div>

      <aside className="osp-public-static-art" aria-label={`${props.title} visual banner`}>
        <div className="osp-public-static-skyline">
          <span />
          <span />
          <span />
        </div>

        <div className="osp-public-static-badge">
          <span>{props.badge || "OSP"}</span>
        </div>

        <div className="osp-public-static-points">
          {points.map((point) => (
            <div key={point}>
              <span />
              <strong>{point}</strong>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
