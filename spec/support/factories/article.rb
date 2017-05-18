FactoryGirl.define do
  factory :article do
    title           { Faker::App.name }
    type            { 'Revenue' }
    workspace       factory: :workspace
  end
end
