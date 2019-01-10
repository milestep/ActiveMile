class Counterparty < ApplicationRecord

  scope :by_year, lambda { |year| where('extract(year from created_at) = ?', year) }
  scope :by_months, lambda { |month| where('extract(month from created_at) = ?', month) }

  self.inheritance_column = nil

  belongs_to  :workspace

  has_many    :registers
  has_many    :inventory_items
  has_many    :client_registers, class_name: 'Register', foreign_key: :client_id
  has_many    :manager_registers, class_name: 'Register', foreign_key: :sales_manager_id

  validates   :name, :date, :type, :workspace_id, :salary, presence: true
  validates   :type, acceptance: { accept: ['Client', 'Vendor' , 'Other'] }, unless: -> { workspace.feature.sales? }
  validates   :type, acceptance: { accept: ['Client', 'Vendor' , 'Other', 'Sales'] }, if: -> { workspace.feature.sales? }

  before_destroy :associate_with_registers?

  def associate_with_registers?
    if registers_count.positive?
      errors.add(:registers, "could not be deleted due to associated registers")
      throw(:abort)
    end
  end
end
