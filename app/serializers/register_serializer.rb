class RegisterSerializer < ActiveModel::Serializer
  attributes :id, :date, :value, :note, :article_id, :counterparty_id, :created_at, :updated_at
  belongs_to :article
  belongs_to :counterparty
end
