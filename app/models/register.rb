class Register < ApplicationRecord
  belongs_to :workspace
  belongs_to :article
  belongs_to :counterparty

  validates :date, :value, :article_id, :workspace_id, presence: true
  validates :value, numericality: { only_integer: true }
end
