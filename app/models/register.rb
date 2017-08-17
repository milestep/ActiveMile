class Register < ApplicationRecord
  belongs_to :workspace
  belongs_to :article
  belongs_to :counterparty

  validates :date, :value, :article_id, :workspace_id, presence: true
  validates :value, numericality: true

  scope :years, -> {
    arr_years = []

    (pluck(:date).map { |d|
      unless arr_years.include?(d.year)
        arr_years.push(d.year)
      end
    })

    arr_years
  }

  scope :get_registers_by_date, -> (year, month) {
    items = []

    all.map { |item|
      if item.date.year == year && month.include?(item.date.mon)
        items.push(item)
      end
    }

    items
  }
end
