Rails.application.routes.draw do
  dashboard_ctrl = 'api/dashboard#index'

  scope :api do
    use_doorkeeper
    get '/', to: dashboard_ctrl
  end

  namespace :api, defaults: { format: 'json' } do
    namespace :v1 do
      resources :users, only: [:index, :create, :show, :update, :destroy]
      resources :workspaces, only: [:index, :create, :update, :destroy]
    end
  end

  root dashboard_ctrl
end
