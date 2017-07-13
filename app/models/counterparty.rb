class Counterparty < ApplicationRecord
  self.inheritance_column = nil

  belongs_to :workspace

  validates :name, :date, :type, :workspace_id, presence: true
  validates :type, acceptance: { accept: ['Client', 'Vendor' , 'Other'] }
end
