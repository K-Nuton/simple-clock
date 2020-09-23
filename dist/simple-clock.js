(() => {
  const Clock = function(container_id) {
    this.current_theme_name = "default";

    this.$container = $(`#${container_id}`);
    this.$dial = this.$container.find(".l-dial");
    this.$hands = this.$container.find(".l-hands")
    this.$marks = this.$container.find(".l-marks");

    this.current_time;
    this.elps_seconds;
    this.elps_minutes;
    this.elps_hours;

    this.deg_seconds;
    this.deg_minutes;
    this.deg_hours;

    this.$hand_second = this.$container.find(".s");
    this.$hand_minute = this.$container.find(".m");
    this.$hand_hour = this.$container.find(".h");

    this.$marks.children().each((i, e) => this.rotate($(e), i * 30));

    this.draw_time();
    setInterval(() => this.draw_time(), 1000);
  };

  const clock_proto = Clock.prototype;
  clock_proto.__defineGetter__("OFFSET", function() {
    return -90;
  });

  clock_proto.__defineGetter__("DEG_SEC_PER_SEC", function() {
    return 6;
  });

  clock_proto.__defineGetter__("DEG_MINUTE_PER_SEC", function() {
    return 0.1;
  });

  clock_proto.__defineGetter__("DEG_HOUR_PER_SEC", function() {
    return 1 / 120;
  });

  clock_proto.get_degree = function(seconds, base_deg) {
    return seconds * base_deg + this.OFFSET;
  };

  clock_proto.record_time = function() {
    this.current_time = new Date();
    this.elps_seconds = this.current_time.getSeconds();
    this.elps_minutes = this.current_time.getMinutes() * 60 + this.elps_seconds;
    this.elps_hours = this.current_time.getHours() * 3600 + this.elps_minutes;

    this.deg_seconds = this.get_degree(this.elps_seconds, this.DEG_SEC_PER_SEC);
    this.deg_minutes = this.get_degree(this.elps_minutes, this.DEG_MINUTE_PER_SEC);
    this.deg_hours = this.get_degree(this.elps_hours, this.DEG_HOUR_PER_SEC);
  };

  clock_proto.rotate = function($e, deg) {
    $e.css({ transform: `rotate(${deg}deg)` });
  };

  clock_proto.draw_time = function() {
    this.record_time();
    this.rotate(this.$hand_second, this.deg_seconds);
    this.rotate(this.$hand_minute, this.deg_minutes);
    this.rotate(this.$hand_hour, this.deg_hours);
  };

  clock_proto.change_theme = function(theme_name) {
    this.change_container(theme_name);
    this.change_dial(theme_name);
    this.change_hands(theme_name);
    this.change_mark(theme_name);
    this.current_theme_name = theme_name;
  };

  clock_proto.change_container = function(theme_name) {
    this.exchange_class(this.$container, theme_name, "container");
  };

  clock_proto.change_dial = function(theme_name) {
    this.exchange_class(this.$dial, theme_name, "dial");
  };

  clock_proto.change_hands = function(theme_name) {
    this.exchange_class(this.$hands, theme_name, "hands");
    this.exchange_class(this.$hands.find(".hand"), theme_name, "hand");
    this.exchange_class(this.$hands.find(".center"), theme_name, "center");
  };

  clock_proto.change_mark = function(theme_name) {
    this.exchange_class(this.$marks, theme_name, "marks");
    this.exchange_class(this.$marks.find(".mark"), theme_name, "mark");
  };

  clock_proto.exchange_class = function($e, theme_name, parts_name) {
    $e.removeClass(`${this.current_theme_name}-${parts_name}`);
    $e.addClass(`${theme_name}-${parts_name}`);
  };

  const clock = new Clock("container");
  clock.change_theme("neumorphism");
  
  const $select_box = $("#custom-select");
  const $choise = $select_box.find(".selected-item");
  let theme_name;
  $select_box.on("click", (e) => {
    if (e.target.tagName === "LI") {
      theme_name = $(e.target).text();
      $choise.text(theme_name);
      clock.change_theme(theme_name);
    }
    $select_box.find(".custom-select").slideToggle(300, null);
  });
})();