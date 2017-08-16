class RegisterSerializer < ActiveModel::Serializer
  attributes :id, :date, :value, :note, :article_id, :counterparty_id
  belongs_to :article
  belongs_to :counterparty
end
