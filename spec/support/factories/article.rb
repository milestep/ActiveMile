FactoryGirl.define do
  factory :article do
    title           { Faker::App.name }
    type            { Faker::Name.name }
    workspace_id    { Faker::Number.number(1) }
  end
end
