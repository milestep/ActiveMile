class Workspace < ApplicationRecord
  has_many   :articles, dependent: :destroy
  has_many   :counterparties, dependent: :destroy
  validates  :title, presence: true
end
