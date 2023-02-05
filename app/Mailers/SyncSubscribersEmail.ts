import mjml from 'mjml'
import View from '@ioc:Adonis/Core/View'
import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'

export default class SyncSubscribersEmail extends BaseMailer {
  constructor (private statistics: Record<string, number>) {
    super()
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  public html = mjml(View.renderSync('emails/admin/update-subscriptions', {
    requiredEmail: false,
    subscribed: this.statistics.subscribed,
    unsubscribed: this.statistics.unsubscribed,
    total_subscribed: this.statistics.total_subscribed,
  })).html

  /**
   * The prepare method is invoked automatically when you run
   * "VerifyEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare (message: MessageContract) {
    message
      .subject('MeshHouse - Update subscriptions successful')
      .from('no-reply@meshhouse.art')
      .to('freida.bayer@ethereal.email')
      .html(this.html)
      .text('MeshHouse - Update subscriptions successful')
      .embed(Application.tmpPath('views/emails/logo_header.png'), 'logo-header')
      .embed(Application.tmpPath('views/emails/email_hero.jpg'), 'hero')
  }
}
