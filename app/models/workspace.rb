class Workspace < ApplicationRecord
  has_one      :feature, dependent: :destroy
  has_many     :articles, dependent: :destroy
  has_many     :counterparties, dependent: :destroy
  has_many     :registers, dependent: :destroy
  has_many     :inventory_items, dependent: :destroy

  validates    :title, presence: true

  after_create :create_feature
end
