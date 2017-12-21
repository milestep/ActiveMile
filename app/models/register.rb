class Register < ApplicationRecord
  belongs_to :workspace
  belongs_to :article, counter_cache: true
  belongs_to :counterparty, counter_cache: true

  validates :date, :value, :article_id, :workspace_id, presence: true
  validates :value, numericality: true

  scope :years, -> {
    distinct.pluck('cast(extract(year from date) as integer)').sort { |a,b| b.to_i <=> a.to_i }
  }

  scope :by_month, -> (year, month) {
    where("cast(extract(year from date) as integer) = ? AND cast(extract(month from date) as integer) IN (?)", year, month)
  }

  scope :by_year, -> (year) {
    where("cast(extract(year from date) as integer) = ?", year)
  }
end
