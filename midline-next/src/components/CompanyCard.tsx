import type { Company } from '@/lib/data'

interface Props {
  company: Company
  sectorTitle?: string
}

export default function CompanyCard({ company, sectorTitle }: Props) {
  return (
    <div className="company-card">
      {sectorTitle && (
        <>
          <div className="company-card-kicker">Our {sectorTitle} Companies</div>
          <h4 className="company-card-title">
            {sectorTitle} portfolio in <em>one page</em>
          </h4>
        </>
      )}
      <div className="company-name">{company.name}</div>
      <div className="company-meta">
        {company.tags.map((tag) => (
          <span key={tag} className="company-tag">{tag}</span>
        ))}
        <span className="company-tag type">{company.type}</span>
      </div>
      <div className="company-desc">{company.desc}</div>
      {company.link && (
        <a href={company.link} target="_blank" rel="noopener noreferrer" className="company-link">
          ↗ {company.link.replace(/https?:\/\//, '')}
        </a>
      )}
    </div>
  )
}
