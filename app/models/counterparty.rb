class Counterparty < ApplicationRecord
  self.inheritance_column = nil

  has_many :registers
  belongs_to :workspace

  validates :name, :date, :type, :workspace_id, presence: true
  validates :type, acceptance: { accept: ['Client', 'Vendor' , 'Other'] }, unless: -> { workspace.feature.sales? }
  validates :type, acceptance: { accept: ['Client', 'Vendor' , 'Other', 'Sales'] }, if: -> { workspace.feature.sales? }

  before_destroy :associate_with_registers?

  def associate_with_registers?
    if registers_count.positive?
      errors.add(:registers, "could not be deleted due to associated registers")
      throw(:abort)
    end
  end
end
