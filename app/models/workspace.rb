class Workspace < ApplicationRecord
  has_many   :articles, dependent: :destroy
  has_many   :counterparties, dependent: :destroy
  has_many   :registers, dependent: :destroy
  validates  :title, presence: true
end
