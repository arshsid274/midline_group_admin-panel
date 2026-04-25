import { MIDLINE_STRUCTURE } from '@/lib/data'
import RevealOnScroll from './RevealOnScroll'

export default function TreeSection() {
  return (
    <div className="structure-shell">
      <div className="structure-head">
        <div className="tree-root">
          <div className="tree-root-card">
            <span>Group Root</span>
            <strong>Midline</strong>
            <p>8 divisions · 24 entities</p>
          </div>
        </div>
        <div className="structure-summary">
          <div className="summary-pill">HQ · Business Bay, Dubai</div>
          <div className="summary-pill">Primary Markets · UAE &amp; Libya</div>
          <div className="summary-pill">Portfolio Reach · 9 Countries</div>
        </div>
      </div>
      <div className="tree-grid">
        {MIDLINE_STRUCTURE.map((branch) => (
          <RevealOnScroll key={branch.key} className="tree-branch" as="article">
            <div className="tree-branch-head">
              <h3>{branch.name}</h3>
              <div className="tree-branch-badge">{branch.companies.length} entities</div>
            </div>
            <ul className="tree-list">
              {branch.companies.map((name) => (
                <li key={name}>
                  <strong>{name}</strong>
                  <span>{branch.markets}</span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  )
}
