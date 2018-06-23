$(".comments-btn").on("click", function () {
    const clickedId = $(this).closest(".card-footer").data("id");
    $(`.modal[data-id='${clickedId}']`).addClass("active");
});

$(".bookmark-btn").on("click", function () {
    const clickedId = $(this).closest(".card-footer").data("id");
    const vizBookmarks = JSON.parse(localStorage.getItem("vizBookmarks"));
    if (vizBookmarks.includes(clickedId)) {
        vizBookmarks.splice(vizBookmarks.indexOf(clickedId), 1);
        $(this).removeClass("btn-primary");
    } else {
        vizBookmarks.push(clickedId);
        $(this).addClass("btn-primary");
    }
    localStorage.setItem("vizBookmarks", JSON.stringify(vizBookmarks));
});

$(".delete-comment-btn").on("click", function () {
    const articleId = $(this).closest(".modal").data("id");
    const commentId = $(this).data("id");
    const commentToDelete = $(this).closest(".tile");
    const dividerToDelete = commentToDelete.prev();
    $.ajax({
        type: "DELETE",
        url: `/articles/${articleId}/comments/${commentId}`,
    }).then((result) => {
        if (result._id) {
            commentToDelete.remove();
            dividerToDelete.remove();
        }
    });
});

$(".submit-comment-btn").on("click", function () {
    const articleId = $(this).closest(".modal").data("id");
    const comment = $(this).prev().val().trim();
    $(this).prev().val("");
    $.post({
        url: `/articles/${articleId}`,
        data: {
            comment,
        },
    }).then((result) => {
        if (result.comments[0]) {
            const newComment = result.comments[0];
            const commentDate = moment(newComment.date).format("MMM D, YYYY [at] h:mm a");
            const newDivider = $("<div class='divider dynamic'>");
            const newTile = $("<div class='tile my-2 dynamic'>").append($("<div class='tile-icon'>").append($("<i class='icon icon-message'>")));
            const tileContent = $("<div class='tile-content'>");
            tileContent.append($("<p class='my-1 tile-title text-gray'>").text(commentDate));
            tileContent.append($("<p class='mb-1 title-subtitle'>").text(newComment.comment));
            newTile.append(tileContent);
            const tileAction = $("<div class='tile-action'>").append($(`<button class='btn btn-action delete-comment-btn' data-id='${comment._id}'>`).append($("<i class='icon icon-delete'>")));
            newTile.append(tileAction);
            $(".modal.active").find(".modal-body").prepend(newDivider, newTile);
        }
    });
});

$(() => {
    if (!localStorage.getItem("vizBookmarks")) {
        localStorage.setItem("vizBookmarks", JSON.stringify([]));
    }
    const vizBookmarks = JSON.parse(localStorage.getItem("vizBookmarks"));

    if ($("#bookmark-nav").hasClass("active")) {
        $(".bookmark-btn").addClass("btn-primary");
        $(".article").each(function () {
            const cardId = $(this).find(".card-footer").data("id");
            if (!vizBookmarks.includes(cardId)) {
                $(this).remove();
            }
        }).promise()
            .done(() => {
                $("#articles-container").show();
            });
    } else {
        vizBookmarks.forEach((articleId) => {
            $(`.card-footer[data-id='${articleId}']`).children(".bookmark-btn").addClass("btn-primary");
        });
        $("#articles-container").show(); // TODO: ideally this would execute only after foreach complete
    }
});
