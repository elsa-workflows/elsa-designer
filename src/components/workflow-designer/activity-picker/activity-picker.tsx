import {Component, Element, h, Method, Event, EventEmitter, State, Prop} from '@stencil/core';
import {ActivityDefinition} from '../../../models';

@Component({
  tag: 'wf-activity-picker',
  styleUrl: 'activity-picker.scss',
  shadow: false
})
export class ActivityPicker {

  @Element()
  el: HTMLElement;

  @Prop()
  activityDefinitions: Array<ActivityDefinition> = [];

  @State()
  isVisible: boolean;

  @State()
  filterText: string = '';

  @State()
  selectedCategory: string = null;

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

  private async onActivitySelected(activity: ActivityDefinition) {
    this.activitySelected.emit(activity);
    await this.hide();
  }

  private onFilterTextChanged = (e: Event) => {
    const filterField = e.target as HTMLInputElement;
    this.filterText = filterField.value;
  };

  private selectCategory = (category: string) => {
    this.selectedCategory = category;
  };

  render() {
    const activities = this.activityDefinitions;
    const categories: string[] = [null, ...new Set(activities.map(x => x.category))];
    const filterText = this.filterText;
    const selectedCategory = this.selectedCategory;
    let definitions = activities;

    if (!!selectedCategory)
      definitions = definitions.filter(x => x.category.toLowerCase() === selectedCategory.toLowerCase());

    if (!!filterText)
      definitions = definitions.filter(x => x.displayName.toLowerCase().includes(filterText.toLowerCase()));

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
                      <input class="form-control" type="search" placeholder="Filter" aria-label="Filter" autofocus
                             onKeyUp={this.onFilterTextChanged}/>
                    </div>
                    <ul class="nav nav-pills flex-column activity-picker-categories">
                      {categories.map(category => {
                        const categoryDisplayText = category || 'All';
                        const isSelected = category === this.selectedCategory;
                        const classes = {'nav-link': true, 'active': isSelected};

                        return (
                          <li class="nav-item">
                            <a class={classes} href="#" data-toggle="pill" onClick={e => {
                              e.preventDefault();
                              this.selectCategory(category);
                            }}>{categoryDisplayText}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div class="col-sm-9 col-md-9 col-lg-10">
                    <div class="card-columns tab-content">
                      {definitions.map(this.renderActivity)}
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

  renderActivity = (activity: ActivityDefinition) => {
    const icon = activity.icon || 'fas fa-cog';
    const iconClass = `${icon} mr-1`;
    return (
      <div class="card activity">
        <div class="card-body">
          <h4 class="card-title"><i class={iconClass}/>{activity.displayName}</h4>
          <p>{activity.description}</p>
          <a href="#" onClick={e => {
            e.preventDefault();
            this.selectCategory(activity.category);
          }}><span class="badge badge-light">{activity.category}</span></a>
        </div>
        <div class="card-footer text-muted text-xs-right">
          <a class="btn btn-primary btn-sm" href="#" onClick={async e => {
            e.preventDefault();
            await this.onActivitySelected(activity);
          }}>Select</a>
        </div>
      </div>
    );
  };
}
