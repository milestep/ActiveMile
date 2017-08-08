class RegistersSerializer < ActiveModel::Serializer
  attributes :id, :date, :value, :article_id, :counterparty_id, :note
end
