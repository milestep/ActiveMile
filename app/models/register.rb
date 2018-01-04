class Register < ApplicationRecord
  belongs_to :workspace
  belongs_to :article, counter_cache: true
  belongs_to :counterparty, counter_cache: true

  validates :date, :value, :article_id, :workspace_id, presence: true
  validates :value, numericality: true

  scope :years, -> {
    distinct.pluck('cast(extract(year from date) as integer)')
            .sort { |a, b| b.to_i <=> a.to_i }
  }

  scope :extract_by_date, -> (year, month = nil) {
    extract_by(:year, year).extract_by(:month, month)
  }

  scope :extract_by, -> (name, value) {
    return unless value.present?
    term = value.kind_of?(Array) ? 'IN (?)' : '= ?'
    where("cast(extract(#{name.to_s} from date) as integer) #{term}", value)
  }
end
