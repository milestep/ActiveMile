class InventoryItem < ApplicationRecord
  belongs_to :user

  validates  :name, presence: true
  validates  :date, presence: true
end
