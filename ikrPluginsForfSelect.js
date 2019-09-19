$.fn.ikrLoadfSelectCombo = function (options) {
    /*
    --> must add 
    <link href="~/Content/fSelect.css" rel="stylesheet" />
    <script src="~/Scripts/fSelect.js"></script>

     $("#cboWashCode").ikrLoadfSelectCombo({
        List: _oWashCodes,
        OptionValue: "Wash_Code",
        DisplayText: "Wash_Name",
        OtherProperties: "Wash_Code,Wash_Name,Wash_Type,Wash_priority,SampleRequisitionId"
    });
    */
    let defaultSettings = $.extend({
        FirstItem: "None",
        List: "",
        DisplayText: "",
        OtherProperties: "",
        PrePrimaryKey: "",
        PrimaryKey: "Id",
        ParentKey: "",
        IsMultiple: true,
        Placeholder: "Search",
        MaxWidth: 275,
        TypeAndSearch: false,
        MethodName: ""
    }, options);
    let selectedCombo = $(this);
    selectedCombo.find("option").remove();
    selectedCombo.parent().css({
        "width": "100%",
        "max-width": defaultSettings.MaxWidth + "px"
    });
    if (defaultSettings.IsMultiple) selectedCombo.attr("multiple", "multiple");
    if (defaultSettings.List == "") defaultSettings.List = [];
    let ikrItems = defaultSettings.List;
    if (defaultSettings.FirstItem != "None") {
        let firstItem = {
            [defaultSettings.PrimaryKey]: 0,
            [defaultSettings.DisplayText]: defaultSettings.FirstItem,
        };
        ikrItems.unshift(firstItem);
    }

    $.map(ikrItems, function (item) {
        let attrs = item != null ? ikrMakeAttrByProperties(defaultSettings, item) : "";
        selectedCombo.append('<option ' + attrs + '>' + item[defaultSettings.DisplayText] + '</option>');
    });
    selectedCombo.fSelect();
    selectedCombo.closest(".fs-wrap").css("width", "100%");
    selectedCombo.closest(".fs-wrap").find(".fs-search input[type='search']").attr("placeholder", defaultSettings.Placeholder);

    var countOption = selectedCombo.siblings(".fs-dropdown").find(".fs-options .g0").length;
    if (countOption == 0) {
        var ikrIndex = 0;
        $.map(ikrItems, function (item) {
            selectedCombo.siblings(".fs-dropdown").find(".fs-options").append("<div class='fs-option g0' data-value=" + item[defaultSettings.DisplayText] + " data-index='" + ikrIndex + "'><span class='fs-checkbox'><i></i></span><div class='fs-option-label'>'" + item[defaultSettings.DisplayText] + "'</div></div>");
            ikrIndex++;
        });
    }
};
$.fn.ikrSetValuefSelectCombo = function (options) {
    /*
     $("#cboWashCode").ikrSetValuefSelectCombo({
            List: oSampleRequisition.WashCodes,
            MatchField: "Wash_Name"
        });
    */
    let defaultSettings = $.extend({
        List: "", //send list or single object
        MatchField: "",
        IsSelectSingleValue: false
    }, options);
    if (defaultSettings.List != "" && defaultSettings.List != null) {
        let selectedCombo = $(this);
        selectedCombo.siblings('.fs-dropdown').find(".fs-option").removeClass("selected");
        let pluginTempList = [];
        if (defaultSettings.IsSelectSingleValue) pluginTempList.push(defaultSettings.List);
        else pluginTempList = defaultSettings.List;
        let items = pluginTempList;
        $.map(items, function (item) {
            selectedCombo.siblings(".fs-dropdown").find(".fs-options").find(".fs-option[data-value = '" + item[defaultSettings.MatchField] + "']").addClass("selected");
        });
        if (defaultSettings.IsSelectSingleValue) {
            selectedCombo.siblings(".fs-label-wrap")
                .find(".fs-label")
                .text((items != null && items.length) > 0 ? items[0][defaultSettings.MatchField] : "Select some options");
        } else {
            selectedCombo.siblings(".fs-label-wrap").find(".fs-label").text((items != null && items.length) > 0 ? items.length + " selected" : "Select some options");
        }
    }
};
$.fn.ikrGetValuefSelectCombo = function (options, callback) {
    var defaultSettings = $.extend({
        PrePrimaryKey: "",
        PrimaryKey: "",
        DataValue: "", //DataValue means DisplayText
        ReturnProperties: "",
        IsReturnSingleValue: false
    }, options);
    let returnList = [];
    let selectedCombo = $(this);
    let tList = [];
    if (defaultSettings.IsReturnSingleValue) {
        let seletcedText = selectedCombo.siblings(".fs-label-wrap").find(".fs-label").text();
        selectedCombo.siblings('.fs-dropdown').find(".fs-options").find(".fs-option").removeClass("selected");
        selectedCombo.siblings('.fs-dropdown').find(".fs-options").find(".fs-option[data-value='" + seletcedText + "']").addClass("selected");
    }
    selectedCombo.siblings('.fs-dropdown').find(".fs-options").find(".selected").each(function () {
        tList.push($(this).attr("data-value"));
    });
    let returnPropertiesList = defaultSettings.ReturnProperties.split(',');
    selectedCombo.find("option").each(function () {
        let currentOption = $(this);
        let selectedItem = tList.find(x=>x == $(this).attr(defaultSettings.DataValue));
        if (selectedItem != "" && typeof selectedItem != "undefined") {
            let dynamicObj = {};
            $.map(returnPropertiesList, function (property) {
                property = $.trim(property);
                dynamicObj[property] = currentOption.attr(property);
            });
            returnList.push(dynamicObj);
        }
        if (defaultSettings.IsReturnSingleValue && returnList.length == 1) return false;
    });
    if (returnList.length > 0 && $.trim(defaultSettings.PrimaryKey) != "") {
        returnList.map(x=>x[defaultSettings.PrimaryKey] = x[defaultSettings.PrePrimaryKey + defaultSettings.PrimaryKey]);
    }
    return callback({ status: true, obj: defaultSettings.IsReturnSingleValue ? returnList[0] : returnList });
};
$.fn.ikrResetfSelectCombo = function (options) {
    //$("#cboWashCode").ikrResetfSelectCombo();
    let defaultSettings = $.extend({
    }, options);
    $(this).siblings('.fs-dropdown').find(".fs-option").removeClass("selected");
    $(this).siblings('.fs-label-wrap').find(".fs-label").text("Select some options");
};
$.fn.ikrRemoveAllfSelectOptions = function (options) {
    //$("#cboWashCode").ikrRemoveAllfSelectOptions();
    let defaultSettings = $.extend({
    }, options);
    $(this).siblings('.fs-dropdown').find(".g0").remove();
    $(this).siblings('.fs-label-wrap').find(".fs-label").text("Select some options");
};

function ikrMakeAttrByProperties(defaultSettings, obj) {
    let attrs = "";
    if ($.trim(defaultSettings.PrimaryKey) != "") attrs += (defaultSettings.PrePrimaryKey + defaultSettings.PrimaryKey) + '="' + obj[defaultSettings.PrimaryKey] + '" ';
    if ($.trim(defaultSettings.OtherProperties) != "") {
        let appendOtherProperties = defaultSettings.OtherProperties.split(',');
        $.map(appendOtherProperties, function (appendOtherPropertie) {
            appendOtherPropertie = $.trim(appendOtherPropertie);
            if (appendOtherPropertie == defaultSettings.ParentKey) attrs += appendOtherPropertie + '="' + obj[defaultSettings.ParentKey] + '" ';
            else attrs += appendOtherPropertie + '="' + obj[appendOtherPropertie] + '" ';
        });
    }
    return attrs;
}