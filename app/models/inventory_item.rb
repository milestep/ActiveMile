class InventoryItem < ApplicationRecord
  validates  :name, presence: true
  validates  :date, presence: true

  belongs_to :user
end
