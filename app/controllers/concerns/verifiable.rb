module Verifiable
  extend ActiveSupport::Concern

  def verifier
    @verifier ||= ActiveSupport::MessageVerifier.new(ENV['SECRET_KEY_BASE'], digest: 'SHA256')
  end
end
