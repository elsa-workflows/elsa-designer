import { Component, Element, h, Method, Event, EventEmitter, State, Prop } from '@stencil/core';
import { ActivityDefinition } from '../../../models';
import $ from "jquery";
import 'bootstrap';
import { Store } from "@stencil/redux";
import { RootState } from "../../../redux/reducers";
import { Action } from "../../../redux/actions";

@Component({
  tag: 'wf-activity-picker',
  styleUrl: 'activity-picker.scss',
  shadow: true
})
export class ActivityPicker {

  @Element()
  el: HTMLElement;

  @Prop({ context: 'store' })
  store: Store<RootState, Action>;

  @State()
  isVisible: boolean;

  @State()
  activityDefinitions: Array<ActivityDefinition> = [];

  @Method()
  async show() {
    this.isVisible = true;
    $(this.modal).modal('show');
  }

  @Method()
  async hide() {
    $(this.modal).modal('hide');
    this.isVisible = false;
  }

  @Event({eventName: 'activity-picked'})
  activitySelected: EventEmitter;

  private modal: any;

  async onActivitySelected(activity: ActivityDefinition) {
    this.activitySelected.emit(activity);
    await this.hide();
  }

  componentDidLoad() {

    this.store.mapStateToProps(this, state => {
      return {
        activityDefinitions: state.activityDefinitions
      }
    });
  }

  render() {
    const categories: string[] = [...new Set(this.activityDefinitions.map(x => x.category))];
    const activities = this.activityDefinitions;

    return (
      <div>
        <div class="modal" tabindex="-1" role="dialog" ref={el => this.modal = el as HTMLElement}>
          <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Available Activities</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-sm-3 col-md-3 col-lg-2">
                    <div class="form-group">
                      <input class="form-control" type="search" placeholder="Filter" aria-label="Filter" autofocus />
                    </div>
                    <ul class="nav nav-pills flex-column activity-picker-categories">
                      <li class="nav-item">
                        <a class="nav-link active" href="#all" data-toggle="pill">All</a>
                      </li>
                      {categories.map(category => (
                        <li class="nav-item" data-category={category}>
                          <a class="nav-link" href="#" data-toggle="pill">{category}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div class="col-sm-9 col-md-9 col-lg-10">
                    <div class="card-columns tab-content">
                      {activities.map(activity => (
                        <div class="card activity">
                          <div class="card-body">
                            <h4 class="card-title"><i class="far fa-envelope" />{activity.displayName}</h4>
                            <p>{activity.description}</p>
                          </div>
                          <div class="card-footer text-muted text-xs-right">
                            <a class="btn btn-primary btn-sm" href="#" onClick={() => this.onActivitySelected(activity)}>Select</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
