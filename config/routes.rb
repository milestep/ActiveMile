Rails.application.routes.draw do
  dashboard_ctrl = 'api/dashboard#index'

  scope :api do
    use_doorkeeper

    namespace :v1 do
      resources :users, only: [:index, :create, :show, :update, :destroy]
    end

    get '/', to: dashboard_ctrl
  end

  root dashboard_ctrl
end
