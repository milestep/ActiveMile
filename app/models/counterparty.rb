class Counterparty < ApplicationRecord
  self.inheritance_column = nil
  belongs_to :workspace
end
