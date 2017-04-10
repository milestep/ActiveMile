class Api::V1::UsersController < Api::V1::BaseController
  before_action :find_user, only: [:show, :update, :destroy]

  def index
    @users = User.all

    if @users.count(:all) > 0
      render json: @users
    else
      render json: { message: 'No Users Found' }, status: 200
    end
  end

  def show
    render
  end

  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: {
        message: 'Could not update profile',
        errors: @user.errors.full_messages
      }, status: 422
    end
  end

  def destroy
    if @user.destroy
      render json: @user.id
    else
      render json: {
        message: 'Could not delete user',
        errors: @user.errors.full_messages
      }, status: 422
    end
  end

  private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end

    def find_user
      @user = User.find(params[:id])
    end
  
end
