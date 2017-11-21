class Counterparty < ApplicationRecord
  self.inheritance_column = nil
  has_many :registers

  belongs_to :workspace

  validates :name, :date, :type, :workspace_id, presence: true
  validates :type, acceptance: { accept: ['Client', 'Vendor' , 'Other'] }

  before_destroy :associate_with_registers?

  def associate_with_registers?
    errors.add(:registers, "cannot delete") if registers_count.positive?
  end
end
