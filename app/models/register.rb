class Register < ApplicationRecord
  belongs_to :workspace
  belongs_to :article
  belongs_to :counterparty
  validates :date, :value, presence: true
end
