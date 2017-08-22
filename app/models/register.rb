class Register < ApplicationRecord
  belongs_to :workspace
  belongs_to :article
  belongs_to :counterparty

  validates :date, :value, :article_id, :workspace_id, presence: true
  validates :value, numericality: true

  scope :years, -> {
    distinct.pluck('cast(extract(year from date) as integer)').sort { |a,b| b.to_i <=> a.to_i }
  }

  scope :by_date, -> (year, month) {
    where("cast(extract(year from date) as integer) = ? AND cast(extract(month from date) as integer) IN (?)", year, month)
  }
end
