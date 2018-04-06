shared_context :doorkeeper_app_with_token do
  let(:application) { create(:doorkeeper_application) }
  let(:user) { create(:user) }
  let!(:access_token) {
    Doorkeeper::AccessToken.create!(application_id: application.id, resource_owner_id: user.id, scopes: :public)
  }
end
